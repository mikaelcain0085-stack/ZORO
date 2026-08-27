import json
import os
import time
import urllib.error
import urllib.request

from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Member, News, Photo, Leader, Enquiry
from .serializers import (
    MemberSerializer,
    NewsSerializer,
    PhotoSerializer,
    LeaderSerializer,
    EnquirySerializer,
)


class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all().order_by("-created_at")
    serializer_class = MemberSerializer


class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all().order_by("-created_at")
    serializer_class = NewsSerializer


class PhotoViewSet(viewsets.ModelViewSet):
    queryset = Photo.objects.all().order_by("-created_at")
    serializer_class = PhotoSerializer


class LeaderViewSet(viewsets.ModelViewSet):
    queryset = Leader.objects.all().order_by("-created_at")
    serializer_class = LeaderSerializer


class EnquiryViewSet(viewsets.ModelViewSet):
    queryset = Enquiry.objects.all().order_by("-created_at")
    serializer_class = EnquirySerializer


# =========================================
# GEMINI-BACKED CHAT ASSISTANT
# =========================================

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

# Tried in order. If the first model is overloaded (503), we fall back
# to the next one before giving up.
GEMINI_MODELS = ["gemini-3.5-flash", "gemini-2.5-flash-lite"]

GEMINI_URL_TEMPLATE = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "{model}:generateContent"
)

# Friendly message shown to visitors only after every model/retry has
# failed (e.g. Gemini is overloaded platform-wide). English + Mizo.
CHAT_BUSY_MESSAGE = (
    "I'm a bit busy right now — please try again in a moment.\n"
    "Ka la buai rih deuh a, nakin deuh ah aw."
)


def build_system_instruction():
    """Feed the model a short, current snapshot of ZORO's own data
    (leaders + recent news) so it can answer visitor questions about
    the organization, not just generic queries."""

    leaders = Leader.objects.all()[:12]
    news = News.objects.order_by("-created_at")[:6]

    leader_lines = "\n".join(
        f"- {leader.name}, {leader.designation}"
        for leader in leaders
    ) or "No leader information available yet."

    news_lines = "\n".join(
        f"- {item.title}" for item in news
    ) or "No recent news available yet."

    return (
        "You are the official website assistant for ZORO, an "
        "organization established in 1988 at Champhai, affiliated "
        "under the United Nations Permanent Forum on Indigenous "
        "Issues (UNPFII) and the Expert Mechanism on the Rights of "
        "Indigenous People (EMRIP) since 2004.\n\n"
        "Current leaders:\n" + leader_lines + "\n\n"
        "Recent news headlines:\n" + news_lines + "\n\n"
        "Answer visitor questions about ZORO helpfully and "
        "accurately using the information above. If a visitor asks "
        "something unrelated to ZORO, you may still answer normally "
        "as a general-purpose assistant. Keep replies friendly, "
        "clear, and reasonably concise."
    )


@api_view(["POST"])
def chat_view(request):
    if not GEMINI_API_KEY:
        return Response(
            {"error": "Chat is not configured on the server."},
            status=503,
        )

    message = (request.data.get("message") or "").strip()

    if not message:
        return Response(
            {"error": "Message is required."}, status=400
        )

    # Optional prior turns from the browser, e.g.
    # [{"role": "user", "text": "..."}, {"role": "model", "text": "..."}]
    history = request.data.get("history") or []

    contents = []

    for turn in history[-10:]:
        role = turn.get("role")
        text = turn.get("text")

        if role in ("user", "model") and text:
            contents.append(
                {"role": role, "parts": [{"text": text}]}
            )

    contents.append(
        {"role": "user", "parts": [{"text": message}]}
    )

    payload = {
        "contents": contents,
        "systemInstruction": {
            "parts": [{"text": build_system_instruction()}]
        },
    }
    body = json.dumps(payload).encode("utf-8")

    data = None
    last_error = None

    # Try each model; retry once on a 503 (overloaded) before moving
    # on to the next model. Anything else (auth, bad request, etc.)
    # is not worth retrying and fails fast.
    for model in GEMINI_MODELS:
        url = GEMINI_URL_TEMPLATE.format(model=model)
        attempts = 2  # initial try + 1 retry, per model

        for attempt in range(attempts):
            req = urllib.request.Request(
                url,
                data=body,
                headers={
                    "Content-Type": "application/json",
                    "x-goog-api-key": GEMINI_API_KEY,
                },
                method="POST",
            )

            try:
                with urllib.request.urlopen(req, timeout=20) as resp:
                    data = json.loads(resp.read().decode("utf-8"))
                last_error = None
                break  # success

            except urllib.error.HTTPError as exc:
                detail = exc.read().decode("utf-8", errors="ignore")
                print(
                    f"Gemini API error ({model}, attempt "
                    f"{attempt + 1}):", exc.code, detail,
                )
                last_error = exc

                if exc.code == 503 and attempt < attempts - 1:
                    time.sleep(1.5)
                    continue  # retry same model once

                break  # move on to next model (or give up)

            except Exception as exc:
                print(
                    f"Gemini request failed ({model}, attempt "
                    f"{attempt + 1}):", exc,
                )
                last_error = exc
                break  # move on to next model (or give up)

        if data is not None:
            break  # got a successful response, stop trying models

    if data is None:
        # Every model/retry failed — most likely Gemini is overloaded
        # platform-wide (503). Tell the visitor plainly instead of a
        # generic error.
        return Response({"reply": CHAT_BUSY_MESSAGE})

    try:
        reply = data["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError, TypeError):
        reply = CHAT_BUSY_MESSAGE

    return Response({"reply": reply})

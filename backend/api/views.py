import json
import os
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
GEMINI_MODEL = "gemini-3.5-flash"
GEMINI_URL = (
    f"https://generativelanguage.googleapis.com/v1beta/models/"
    f"{GEMINI_MODEL}:generateContent"
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

    req = urllib.request.Request(
        GEMINI_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "x-goog-api-key": GEMINI_API_KEY,
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="ignore")
        print("Gemini API error:", exc.code, detail)

        return Response(
            {"error": "Chat service returned an error."},
            status=502,
        )
    except Exception as exc:
        print("Gemini request failed:", exc)

        return Response(
            {"error": "Could not reach the chat service."},
            status=502,
        )

    try:
        reply = data["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError, TypeError):
        reply = (
            "Sorry, I couldn't generate a response just now. "
            "Please try again."
        )

    return Response({"reply": reply})

const ADMIN_USER = "zoro";
const ADMIN_PASS = "1234";

const NEWS_KEY = "zoro_news";
const PHOTO_KEY = "zoro_photos";
const LEADER_KEY = "zoro_leaders";

const landing = document.getElementById("landing");
const admin = document.getElementById("admin");
const newsPage = document.getElementById("news");
const modal = document.getElementById("loginModal");
const openBtn = document.getElementById("adminLoginBtn");
const closeBtn = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const logoutBtn = document.getElementById("logoutBtn");
const contactNavBtn = document.getElementById("contactNavBtn");
const getInTouchBtn = document.getElementById("getInTouchBtn");
const contactPage = document.getElementById("contactPage");
const backFromContact = document.getElementById("backFromContact");
const contactForm = document.getElementById("contactForm");
const contactName = document.getElementById("contactName");
const contactEmail = document.getElementById("contactEmail");
const contactPhone = document.getElementById("contactPhone");
const contactSubject = document.getElementById("contactSubject");
const contactMessage = document.getElementById("contactMessage");
const contactSuccessToast = document.getElementById("contactSuccessToast");


const memberForm = document.getElementById("memberForm");
const membersList = document.getElementById("membersList");
const memberCount = document.getElementById("memberCount");
const enquiriesList = document.getElementById("enquiriesList");
const enquiryCount = document.getElementById("enquiryCount");
const successToast = document.getElementById("successToast");

const newsCard = document.getElementById("newsCard");
const backFromNews = document.getElementById("backFromNews");
const newsFeed = document.getElementById("newsFeed");
const newsFeedCount = document.getElementById("newsFeedCount");
const newsForm = document.getElementById("newsForm");
const newsList = document.getElementById("newsList");
const newsCount = document.getElementById("newsCount");
const newsSuccessToast = document.getElementById("newsSuccessToast");
const newsFormTitle = document.getElementById("newsFormTitle");
const newsSubmitBtn = document.getElementById("newsSubmitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const editingNewsId = document.getElementById("editingNewsId");
const newsImageInput = document.getElementById("newsImage");
const imagePreview = document.getElementById("imagePreview");
const imageHint = document.getElementById("imageHint");
const removeImageBtn = document.getElementById("removeImageBtn");
const newsPdfInput = document.getElementById("newsPdf");
const pdfFileName = document.getElementById("pdfFileName");
const pdfHint = document.getElementById("pdfHint");
const removePdfBtn = document.getElementById("removePdfBtn");

let currentPdfFile = null;
let currentPdfUrl = null;

const galleryPage = document.getElementById("gallery");
const galleryCard = document.getElementById("galleryCard");
const backFromGallery = document.getElementById("backFromGallery");
const galleryFeed = document.getElementById("galleryFeed");
const galleryFeedCount = document.getElementById("galleryFeedCount");
const photoForm = document.getElementById("photoForm");
const photoList = document.getElementById("photoList");
const photoCount = document.getElementById("photoCount");
const photoSuccessToast = document.getElementById("photoSuccessToast");
const photoFormTitle = document.getElementById("photoFormTitle");
const photoSubmitBtn = document.getElementById("photoSubmitBtn");
const cancelPhotoEditBtn = document.getElementById("cancelPhotoEditBtn");
const editingPhotoId = document.getElementById("editingPhotoId");
const photoImageInput = document.getElementById("photoImage");
const photoPreview = document.getElementById("photoPreview");
const photoHint = document.getElementById("photoHint");
const removePhotoBtn = document.getElementById("removePhotoBtn");

const leadersPage = document.getElementById("leaders");
const leadersCard = document.getElementById("leadersCard");
const backFromLeaders = document.getElementById("backFromLeaders");
const leadersFeed = document.getElementById("leadersFeed");
const leadersFeedCount = document.getElementById("leadersFeedCount");

const membersPage = document.getElementById("members");
const membersCard = document.getElementById("membersCard");
const backFromMembers = document.getElementById("backFromMembers");
const membersFeed = document.getElementById("membersFeed");
const membersFeedCount = document.getElementById("membersFeedCount");

const leaderForm = document.getElementById("leaderForm");
const leaderList = document.getElementById("leaderList");
const leaderCount = document.getElementById("leaderCount");
const leaderSuccessToast = document.getElementById("leaderSuccessToast");
const leaderFormTitle = document.getElementById("leaderFormTitle");
const leaderSubmitBtn = document.getElementById("leaderSubmitBtn");
const cancelLeaderEditBtn = document.getElementById("cancelLeaderEditBtn");
const editingLeaderId = document.getElementById("editingLeaderId");
const leaderImageInput = document.getElementById("leaderImage");
const leaderPreview = document.getElementById("leaderPreview");
const leaderHint = document.getElementById("leaderHint");
const removeLeaderBtn = document.getElementById("removeLeaderBtn");

let currentImageData = null;
let currentPhotoData = null;
let currentLeaderData = null;


/* =========================================
   DJANGO API
========================================= */

const API_BASE = "https://zoro-s8oa.onrender.com/api";
const BACKEND_URL = "https://zoro-s8oa.onrender.com";
/* =========================================
   NEWS DJANGO API
========================================= */

async function getNewsFromApi() {
    const response = await fetch(`${API_BASE}/news/`);

    if (!response.ok) {
        throw new Error("Could not load news");
    }

    return await response.json();
}


async function createNews(formData) {
    const response = await fetch(`${API_BASE}/news/`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.text();

        console.error(errorData);

        throw new Error("Could not publish news");
    }

    return await response.json();
}


async function updateNewsApi(id, formData) {
    const response = await fetch(
        `${API_BASE}/news/${id}/`,
        {
            method: "PATCH",
            body: formData,
        }
    );

    if (!response.ok) {
        const errorData = await response.text();

        console.error(errorData);

        throw new Error("Could not update news");
    }

    return await response.json();
}


async function deleteNewsApi(id) {
    const response = await fetch(
        `${API_BASE}/news/${id}/`,
        {
            method: "DELETE",
        }
    );

    if (!response.ok) {
        throw new Error("Could not delete news");
    }
}


async function getMembers() {
    const response = await fetch(`${API_BASE}/members/`);

    if (!response.ok) {
        throw new Error("Could not load members");
    }

    return await response.json();
}


async function addMember(member) {
    const response = await fetch(`${API_BASE}/members/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            full_name: member.full_name,
            phone: member.phone,
            email: member.email || "",
            address: member.address || "",
        }),
    });

    if (!response.ok) {
        throw new Error("Could not add member");
    }

    return await response.json();
}


async function deleteMember(id) {
    const response = await fetch(`${API_BASE}/members/${id}/`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Could not delete member");
    }

    return true;
}
async function getEnquiries() {

    try {

        const response = await fetch(
            `${API_BASE}/enquiries/`
        );

        if (!response.ok) {
            throw new Error("Failed to load enquiries");
        }
        const enquiries = await response.json();

        renderEnquiriesAdmin(enquiries);

        console.log("Enquiries loaded");

    } catch (error) {

        console.error(
            "Error loading enquiries:",
            error
        );

        enquiriesList.innerHTML = `
            <div class="empty-state">
                <span>⚠️</span>
                Could not load enquiries.
            </div>
        `;

    }

}
function renderEnquiriesAdmin(enquiries) {

    enquiryCount.textContent = enquiries.length;

    if (enquiries.length === 0) {

        enquiriesList.innerHTML = `
            <div class="empty-state">
                <span>📩</span>
                No enquiries yet.
            </div>
        `;

        return;

    }
    async function deleteEnquiry(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this enquiry?"
    );

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE}/enquiries/${id}/`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error(
                "Could not delete enquiry"
            );
        }

        await getEnquiries();

        alert(
            "Enquiry deleted successfully."
        );

    } catch (error) {

        console.error(
            "Delete enquiry error:",
            error
        );

        alert(
            "Unable to delete enquiry. Please try again."
        );

    }

}

    enquiriesList.innerHTML = enquiries.map((enquiry) => {

        const date = new Date(
            enquiry.created_at
        ).toLocaleString();

        return `
            <div class="enquiry-item">

                <div class="enquiry-header">

                    <h3>
                        ${enquiry.subject}
                    </h3>

                    <span class="enquiry-date">
                        ${date}
                    </span>

                </div>

                <p>
                    <strong>Name:</strong>
                    ${enquiry.name}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${enquiry.email}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${enquiry.phone || "Not provided"}
                </p>

                <div class="enquiry-message">

                    <strong>Message:</strong>

                    <p>
                        ${enquiry.message}
                    </p>
                

                </div>
                <button
                    class="btn-delete-enquiry"
                    data-enquiry-id="${enquiry.id}"
                >
                  🗑 Delete Enquiry
                </button>

            </div>
        `;

    }).join("");
    const deleteButtons = document.querySelectorAll(
        ".btn-delete-enquiry"
    );

    deleteButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const enquiryId = button.getAttribute(
                "data-enquiry-id"
           );

           deleteEnquiry(enquiryId);

        });

    });

}


/* =========================================
   NEWS LOCAL STORAGE
========================================= */

/* =========================================
   RENDER NEWS ADMIN
========================================= */


async function getNews() {
    try {
        const response = await fetch(
            `${API_BASE}/news/`
        );

        if (!response.ok) {
            throw new Error(
                "Could not load news."
            );
        }

        return await response.json();

    } catch (error) {

        console.error(
            "Error loading news:",
            error
        );

        return [];
    }
}


async function createNews(formData) {

    const response = await fetch(
        `${API_BASE}/news/`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {

        const errorData =
            await response.json();

        console.error(
            "News creation error:",
            errorData
        );

        throw new Error(
            "Could not publish news."
        );
    }

    return await response.json();
}


async function updateNewsApi(
    id,
    formData
) {

    const response = await fetch(
        `${API_BASE}/news/${id}/`,
        {
            method: "PATCH",
            body: formData,
        }
    );

    if (!response.ok) {

        const errorData =
            await response.json();

        console.error(
            "News update error:",
            errorData
        );

        throw new Error(
            "Could not update news."
        );
    }

    return await response.json();
}


async function deleteNews(id) {

    const response = await fetch(
        `${API_BASE}/news/${id}/`,
        {
            method: "DELETE",
        }
    );

    if (!response.ok) {

        throw new Error(
            "Could not delete news."
        );
    }

    return true;
}


/* =========================================
   PHOTO DJANGO API
========================================= */

async function getPhotos() {
    try {
        const response = await fetch(`${API_BASE}/photos/`);

        if (!response.ok) {
            throw new Error("Could not load photos.");
        }

        return await response.json();
    } catch (error) {
        console.error("Error loading photos:", error);
        return [];
    }
}

async function addPhoto(formData) {
    const response = await fetch(`${API_BASE}/photos/`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.text();
        console.error(errorData);
        throw new Error("Could not upload photo");
    }

    return await response.json();
}

async function updatePhoto(id, formData) {
    const response = await fetch(`${API_BASE}/photos/${id}/`, {
        method: "PATCH",
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.text();
        console.error(errorData);
        throw new Error("Could not update photo");
    }

    return await response.json();
}

async function deletePhoto(id) {
    const response = await fetch(`${API_BASE}/photos/${id}/`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Could not delete photo.");
    }

    return true;
}


/* =========================================
   LEADERS DJANGO API
========================================= */

async function getLeaders() {
    try {
        const response = await fetch(`${API_BASE}/leaders/`);

        if (!response.ok) {
            throw new Error("Could not load leaders.");
        }

        return await response.json();
    } catch (error) {
        console.error("Error loading leaders:", error);
        return [];
    }
}

async function addLeader(formData) {
    const response = await fetch(`${API_BASE}/leaders/`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.text();
        console.error(errorData);
        throw new Error("Could not add leader");
    }

    return await response.json();
}

async function updateLeader(id, formData) {
    const response = await fetch(`${API_BASE}/leaders/${id}/`, {
        method: "PATCH",
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.text();
        console.error(errorData);
        throw new Error("Could not update leader");
    }

    return await response.json();
}

async function deleteLeader(id) {
    const response = await fetch(`${API_BASE}/leaders/${id}/`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Could not delete leader.");
    }

    return true;
}


/* =========================================
   HELPER FUNCTIONS
========================================= */

function escapeHtml(text) {
    const div = document.createElement("div");

    div.textContent = text || "";

    return div.innerHTML;
}


function formatDate(iso) {
    try {
        return new Date(iso).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return "";
    }
}


function isRecent(iso) {
    try {
        return (
            Date.now() - new Date(iso).getTime() <
            7 * 24 * 60 * 60 * 1000
        );
    } catch {
        return false;
    }
}


/* =========================================
   NEWS IMAGE UPLOAD
========================================= */

function clearImageUpload() {
    currentImageData = null;

    newsImageInput.value = "";
    imagePreview.src = "";

    imagePreview.classList.remove("show");

    imageHint.style.display = "";

    removeImageBtn.classList.remove("show");
}


function setImagePreview(dataUrl) {
    currentImageData = dataUrl;

    imagePreview.src = dataUrl;

    imagePreview.classList.add("show");

    imageHint.style.display = "none";

    removeImageBtn.classList.add("show");
}


newsImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 1.5 * 1024 * 1024) {
        alert("Image too large. Please use an image under 1.5 MB.");

        newsImageInput.value = "";

        return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
        setImagePreview(event.target.result);
    };

    reader.readAsDataURL(file);
});


removeImageBtn.addEventListener("click", clearImageUpload);
/* =========================================
   NEWS PDF UPLOAD
========================================= */

function clearPdfUpload() {
    currentPdfFile = null;
    currentPdfUrl = null;

    newsPdfInput.value = "";

    pdfFileName.textContent = "";

    if (pdfHint) {
        pdfHint.style.display = "";
    }

    removePdfBtn.classList.remove("show");
}


newsPdfInput.addEventListener("change", (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
        alert("Please select a valid PDF file.");

        clearPdfUpload();

        return;
    }

    currentPdfFile = file;

    pdfFileName.textContent = `📄 ${file.name}`;

    if (pdfHint) {
        pdfHint.style.display = "none";
    }

    removePdfBtn.classList.add("show");
});


removePdfBtn.addEventListener(
    "click",
    clearPdfUpload
);


/* =========================================
   PHOTO IMAGE UPLOAD
========================================= */

function clearPhotoUpload() {
    currentPhotoData = null;

    photoImageInput.value = "";
    photoPreview.src = "";

    photoPreview.classList.remove("show");

    photoHint.style.display = "";

    removePhotoBtn.classList.remove("show");
}


function setPhotoPreview(dataUrl) {
    currentPhotoData = dataUrl;

    photoPreview.src = dataUrl;

    photoPreview.classList.add("show");

    photoHint.style.display = "none";

    removePhotoBtn.classList.add("show");
}


photoImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 1.5 * 1024 * 1024) {
        alert("Image too large. Please use an image under 1.5 MB.");

        photoImageInput.value = "";

        return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
        setPhotoPreview(event.target.result);
    };

    reader.readAsDataURL(file);
});


removePhotoBtn.addEventListener("click", clearPhotoUpload);


/* =========================================
   LEADER IMAGE UPLOAD
========================================= */

function clearLeaderUpload() {
    currentLeaderData = null;

    leaderImageInput.value = "";
    leaderPreview.src = "";

    leaderPreview.classList.remove("show");

    leaderHint.style.display = "";

    removeLeaderBtn.classList.remove("show");
}


function setLeaderPreview(dataUrl) {
    currentLeaderData = dataUrl;

    leaderPreview.src = dataUrl;

    leaderPreview.classList.add("show");

    leaderHint.style.display = "none";

    removeLeaderBtn.classList.add("show");
}


leaderImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 1.5 * 1024 * 1024) {
        alert("Image too large. Please use an image under 1.5 MB.");

        leaderImageInput.value = "";

        return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
        setLeaderPreview(event.target.result);
    };

    reader.readAsDataURL(file);
});


removeLeaderBtn.addEventListener("click", clearLeaderUpload);


/* =========================================
   IMAGE LIGHTBOX
========================================= */

const imgLightbox = document.getElementById("imgLightbox");
const imgLightboxImg = document.getElementById("imgLightboxImg");
const imgLightboxClose = document.getElementById("imgLightboxClose");


function openLightbox(src) {
    if (!src) return;

    imgLightboxImg.src = src;

    imgLightbox.classList.add("active");

    document.body.style.overflow = "hidden";
}


function closeLightbox() {
    imgLightbox.classList.remove("active");

    imgLightboxImg.src = "";

    document.body.style.overflow = "";
}


imagePreview.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (
        imagePreview.classList.contains("show") &&
        imagePreview.src
    ) {
        openLightbox(imagePreview.src);
    }
});


photoPreview.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (
        photoPreview.classList.contains("show") &&
        photoPreview.src
    ) {
        openLightbox(photoPreview.src);
    }
});


leaderPreview.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (
        leaderPreview.classList.contains("show") &&
        leaderPreview.src
    ) {
        openLightbox(leaderPreview.src);
    }
});


imgLightboxClose.addEventListener("click", (e) => {
    e.stopPropagation();

    closeLightbox();
});


imgLightbox.addEventListener("click", (e) => {
    if (e.target === imgLightbox) {
        closeLightbox();
    }
});


document.addEventListener("keydown", (e) => {
    if (
        e.key === "Escape" &&
        imgLightbox.classList.contains("active")
    ) {
        closeLightbox();
    }
});


/* =========================================
   RESET FORMS
========================================= */

function resetNewsForm() {
    newsForm.reset();

    editingNewsId.value = "";

    newsFormTitle.textContent = "Upload News";

    newsSubmitBtn.textContent = "Publish News";

    cancelEditBtn.style.display = "none";

    clearImageUpload();

    clearPdfUpload();
}

function resetPhotoForm() {
    photoForm.reset();

    editingPhotoId.value = "";

    photoFormTitle.textContent = "Upload Photo";

    photoSubmitBtn.textContent = "Upload Photo";

    cancelPhotoEditBtn.style.display = "none";

    clearPhotoUpload();
}


function resetLeaderForm() {
    leaderForm.reset();

    editingLeaderId.value = "";

    leaderFormTitle.textContent = "Add Leader";

    leaderSubmitBtn.textContent = "Add Leader";

    cancelLeaderEditBtn.style.display = "none";

    clearLeaderUpload();
}


/* =========================================
   EDIT FUNCTIONS
========================================= */

async function startEditNews(id) {
    const news = await getNews();
    const item = news.find((news) => news.id === id);

    if (!item) return;

    editingNewsId.value = id;

    document.getElementById("newsTitle").value = item.title;

    document.getElementById("newsContent").value = item.content;

    newsFormTitle.textContent = "Edit News";

    newsSubmitBtn.textContent = "Update News";

    cancelEditBtn.style.display = "block";

    if (item.image) {
        setImagePreview(item.image);
    } else {
        clearImageUpload();
    }

    switchAdminSubview("newsUploadView");

    document
        .getElementById("newsTitle")
        .scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
}


cancelEditBtn.addEventListener("click", resetNewsForm);


async function startEditPhoto(id) {
    const photos = await getPhotos();
    const item = photos.find((photo) => photo.id === id);

    if (!item) return;

    editingPhotoId.value = id;

    document.getElementById("photoDescription").value =
        item.description || "";

    photoFormTitle.textContent = "Edit Photo";

    photoSubmitBtn.textContent = "Update Photo";

    cancelPhotoEditBtn.style.display = "block";

    if (item.image) {
        setPhotoPreview(item.image);
    } else {
        clearPhotoUpload();
    }

    switchAdminSubview("photosUploadView");

    document
        .getElementById("photoDescription")
        .scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
}


cancelPhotoEditBtn.addEventListener(
    "click",
    resetPhotoForm
);


async function startEditLeader(id) {
    const leaders = await getLeaders();
    const item = leaders.find(
        (leader) => leader.id === id
    );

    if (!item) return;

    editingLeaderId.value = id;

    document.getElementById("leaderName").value =
        item.name || "";

    document.getElementById("leaderDesignation").value =
        item.designation || "";

    document.getElementById("leaderPhone").value =
        item.phone || "";

    document.getElementById("leaderAddress").value =
        item.address || "";

    leaderFormTitle.textContent = "Edit Leader";

    leaderSubmitBtn.textContent = "Update Leader";

    cancelLeaderEditBtn.style.display = "block";

    if (item.image) {
        setLeaderPreview(item.image);
    } else {
        clearLeaderUpload();
    }

    switchAdminSubview("leadersUploadView");

    document
        .getElementById("leaderName")
        .scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
}


cancelLeaderEditBtn.addEventListener(
    "click",
    resetLeaderForm
);


/* =========================================
   RENDER ADMIN MEMBERS
========================================= */

async function renderMembers() {
    try {
        const members = await getMembers();

        memberCount.textContent = members.length;

        if (members.length === 0) {
            membersList.innerHTML = `
                <div class="empty-state">
                    <span>📋</span>
                    No members yet. Add the first one!
                </div>
            `;

            return;
        }

        membersList.innerHTML = members
            .map(
                (member) => `
                <div class="member-card">

                    <div class="member-info">

                        <h3>
                            ${escapeHtml(member.full_name)}
                        </h3>

                        <p>
                            📞 ${escapeHtml(member.phone)}
                        </p>

                        ${
                            member.email
                                ? `
                                <p>
                                    ✉️ ${escapeHtml(member.email)}
                                </p>
                            `
                                : ""
                        }

                        ${
                            member.address
                                ? `
                                <p>
                                    📍 ${escapeHtml(member.address)}
                                </p>
                            `
                                : ""
                        }

                    </div>

                    <button
                        class="btn-delete"
                        data-id="${member.id}"
                    >
                        Delete
                    </button>

                </div>
            `
            )
            .join("");

        membersList
            .querySelectorAll(".btn-delete")
            .forEach((button) => {
                button.addEventListener(
                    "click",
                    async () => {
                        if (
                            confirm(
                                "Delete this member?"
                            )
                        ) {
                            try {
                                await deleteMember(
                                    button.dataset.id
                                );

                                await renderMembers();
                            } catch (error) {
                                console.error(error);

                                alert(
                                    "Could not delete member."
                                );
                            }
                        }
                    }
                );
            });
    } catch (error) {
        console.error(error);

        membersList.innerHTML = `
            <div class="empty-state">
                <span>⚠️</span>
                Could not load members. Please make sure the Django server is running.
            </div>
        `;
    }
}


/* =========================================
   RENDER NEWS ADMIN
========================================= */

async function renderNewsAdmin() {

    const news = await getNews();

    newsCount.textContent = news.length;

    if (news.length === 0) {

        newsList.innerHTML = `
            <div class="empty-state">
                <span>📰</span>
                No news yet. Publish the first one!
            </div>
        `;

        return;
    }

    newsList.innerHTML = news
        .map(
            (item) => `
            <div class="news-card">

                <div class="news-card-left">

                    ${
                        item.image
                            ? `
                            <img
                                class="thumb"
                                src="${item.image}"
                                alt=""
                            >
                        `
                            : ""
                    }

                    <div class="news-info">

                        <h3>
                            ${escapeHtml(item.title)}
                        </h3>

                        <p>
                            ${escapeHtml(
                                (item.content || "").substring(
                                    0,
                                    100
                                )
                            )}
                            ${
                                (item.content || "").length > 100
                                    ? "..."
                                    : ""
                            }
                        </p>

                        <span class="news-date">
                            ${formatDate(item.created_at)}
                        </span>

                    </div>

                </div>

                <div class="card-actions">

                    <button
                        class="btn-edit"
                        data-id="${item.id}"
                    >
                        Edit
                    </button>

                    <button
                        class="btn-delete"
                        data-id="${item.id}"
                    >
                        Delete
                    </button>

                </div>

            </div>
        `
        )
        .join("");


    /* =========================================
       EDIT NEWS BUTTON
    ========================================= */

    newsList
        .querySelectorAll(".btn-edit")
        .forEach((button) => {

            button.addEventListener(
                "click",
                async () => {

                    await startEditNews(
                        button.dataset.id
                    );

                }
            );

        });


    /* =========================================
       DELETE NEWS BUTTON
    ========================================= */

    newsList
        .querySelectorAll(".btn-delete")
        .forEach((button) => {

            button.addEventListener(
                "click",
                async () => {

                    if (
                        confirm(
                            "Delete this news?"
                        )
                    ) {

                        try {

                            await deleteNews(
                                button.dataset.id
                            );

                            await renderNewsAdmin();


                            if (
                                editingNewsId.value ===
                                button.dataset.id
                            ) {

                                resetNewsForm();

                            }

                        } catch (error) {

                            console.error(
                                "Error deleting news:",
                                error
                            );

                            alert(
                                "Could not delete news. Please try again."
                            );

                        }

                    }

                }
            );

        });


    /* =========================================
       IMAGE LIGHTBOX
    ========================================= */

    newsList
        .querySelectorAll(".thumb")
        .forEach((image) => {

            image.addEventListener(
                "click",
                () => {

                    openLightbox(
                        image.src
                    );

                }
            );

        });

}
/* =========================================
   RENDER NEWS PUBLIC
========================================= */

async function renderNewsFeed() {

    try {

        const response = await fetch(
            `${API_BASE}/news/`
        );

        if (!response.ok) {
            throw new Error(
                "Could not load news"
            );
        }
        const news = await response.json();

        const count = news.length;

        newsFeedCount.textContent =
            count === 0
                ? "0 articles"
                : count === 1
                ? "1 article"
                : `${count} articles`;


        if (count === 0) {

            newsFeed.innerHTML = `
                <div class="news-empty-premium">

                    <div class="icon">
                        📰
                    </div>

                    <h3>
                        No news published yet
                    </h3>

                    <p>
                        Check back soon for official updates from ZORO.
                    </p>

                </div>
            `;

            return;
        }


        newsFeed.innerHTML = news
            .map(
                (item) => `

                <article class="news-article">

                    <div class="news-article-meta">

                        <span class="news-article-date">

                            ${formatDate(
                                item.created_at
                            )}

                        </span>

                        ${

                            isRecent(
                                item.created_at
                            )

                                ? `
                                <span class="news-article-badge">
                                    New
                                </span>
                                `

                                : ""

                        }

                    </div>


                    <h3>

                        ${escapeHtml(
                            item.title
                        )}

                    </h3>


                    ${

                        item.image

                            ? `
                            <img 
                                class="news-article-img" 
                                src="${item.image}" 
                                alt="" 
                            >
                            `

                            : ""

                    }


                    <div class="news-article-body">

                        ${escapeHtml(
                            item.content || ""
                        )}

                    </div>


                    ${

                        item.pdf

                            ? `
                            <div class="news-pdf-container">

                                <a
                                    href="${item.pdf.startsWith("http")
                                        ? item.pdf
                                        : BACKEND_URL + item.pdf}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="news-pdf-button" 
                                >
                                    <span class="pdf-icon">📄</span>
                                    <span>View PDF Document</span>
                                    <span class="pdf-arrow">↗</span>      
                                </a>

                            </div>
                            `

                            : ""

                    }

                </article>

                `
            )
            .join("");


    } catch (error) {

        console.error(
            "Error loading news:",
            error
        );


        newsFeedCount.textContent =
            "0 articles";


        newsFeed.innerHTML = `
            <div class="news-empty-premium">

                <div class="icon">
                    ⚠️
                </div>

                <h3>
                    Could not load news
                </h3>

                <p>
                    Please make sure the Django server is running.
                </p>

            </div>
        `;

    }

}


/* =========================================
   RENDER PHOTOS ADMIN
========================================= */

async function renderPhotosAdmin() {
    const photos = await getPhotos();

    photoCount.textContent = photos.length;

    if (photos.length === 0) {
        photoList.innerHTML = `
            <div class="empty-state">
                <span>📷</span>
                No photos yet. Upload the first one!
            </div>
        `;

        return;
    }

    photoList.innerHTML = photos
        .map(
            (photo) => `
            <div class="news-card">

                <div class="news-card-left">

                    ${
                        photo.image
                            ? `
                            <img
                                class="thumb"
                                src="${photo.image}"
                                alt=""
                            >
                        `
                            : ""
                    }

                    <div class="news-info">

                        <h3>
                            ${escapeHtml(
                                (
                                    photo.description || ""
                                ).substring(0, 60)
                            )}
                            ${
                                (
                                    photo.description || ""
                                ).length > 60
                                    ? "..."
                                    : ""
                            }
                        </h3>

                        <span class="news-date">
                            ${formatDate(
                                photo.created_at
                            )}
                        </span>

                    </div>

                </div>

                <div class="card-actions">

                    <button
                        class="btn-edit"
                        data-id="${photo.id}"
                    >
                        Edit
                    </button>

                    <button
                        class="btn-delete"
                        data-id="${photo.id}"
                    >
                        Delete
                    </button>

                </div>

            </div>
        `
        )
        .join("");

    photoList
        .querySelectorAll(".btn-edit")
        .forEach((button) => {
            button.addEventListener("click", async () => {
                await startEditPhoto(button.dataset.id);
            });
        });

    photoList
        .querySelectorAll(".btn-delete")
        .forEach((button) => {
            button.addEventListener("click", async () => {
                if (confirm("Delete this photo?")) {
                    try {
                        await deletePhoto(button.dataset.id);

                        await renderPhotosAdmin();

                        if (
                            editingPhotoId.value ===
                            button.dataset.id
                        ) {
                            resetPhotoForm();
                        }
                    } catch (error) {
                        console.error("Error deleting photo:", error);
                        alert("Could not delete photo. Please try again.");
                    }
                }
            });
        });

    photoList
        .querySelectorAll(".thumb")
        .forEach((image) => {
            image.addEventListener("click", () => {
                openLightbox(image.src);
            });
        });
}


/* =========================================
   RENDER GALLERY
========================================= */

async function renderGalleryFeed() {
    const photos = await getPhotos();

    const count = photos.length;

    galleryFeedCount.textContent =
        count === 0
            ? "0 photos"
            : count === 1
            ? "1 photo"
            : `${count} photos`;

    if (count === 0) {
        galleryFeed.innerHTML = `
            <div
                class="news-empty-premium"
                style="grid-column: 1 / -1;"
            >

                <div class="icon">📷</div>

                <h3>No photos yet</h3>

                <p>
                    Check back soon for photos from ZORO.
                </p>

            </div>
        `;

        return;
    }

    galleryFeed.innerHTML = photos
        .map(
            (photo) => `
            <div class="gallery-item">

                <img
                    src="${photo.image}"
                    alt=""
                    data-full="${photo.image}"
                >

                <div class="gallery-item-body">

                    <p>
                        ${escapeHtml(
                            photo.description || ""
                        )}
                    </p>

                    <span class="gallery-item-date">
                        ${formatDate(
                            photo.created_at
                        )}
                    </span>

                </div>

            </div>
        `
        )
        .join("");

    galleryFeed
        .querySelectorAll("img")
        .forEach((image) => {
            image.addEventListener("click", () => {
                openLightbox(
                    image.dataset.full || image.src
                );
            });
        });
}


/* =========================================
   RENDER LEADERS ADMIN
========================================= */

async function renderLeadersAdmin() {
    const leaders = await getLeaders();

    leaderCount.textContent = leaders.length;

    if (leaders.length === 0) {
        leaderList.innerHTML = `
            <div class="empty-state">
                <span>👥</span>
                No leaders yet. Add the first one!
            </div>
        `;

        return;
    }

    leaderList.innerHTML = leaders
        .map(
            (leader) => `
            <div class="news-card">

                <div class="news-card-left">

                    ${
                        leader.image
                            ? `
                            <img
                                class="thumb"
                                src="${leader.image}"
                                alt=""
                            >
                        `
                            : ""
                    }

                    <div class="news-info">

                        <h3>
                            ${escapeHtml(leader.name)}
                        </h3>

                        <p>
                            ${escapeHtml(
                                leader.designation || ""
                            )}
                        </p>

                        <p>
                            📞 ${escapeHtml(
                                leader.phone || ""
                            )}
                        </p>

                        <p>
                            📍 ${escapeHtml(
                                leader.address || ""
                            )}
                        </p>

                        <span class="news-date">
                            ${formatDate(
                                leader.created_at
                            )}
                        </span>

                    </div>

                </div>

                <div class="card-actions">

                    <button
                        class="btn-edit"
                        data-id="${leader.id}"
                    >
                        Edit
                    </button>

                    <button
                        class="btn-delete"
                        data-id="${leader.id}"
                    >
                        Delete
                    </button>

                </div>

            </div>
        `
        )
        .join("");

    leaderList
        .querySelectorAll(".btn-edit")
        .forEach((button) => {
            button.addEventListener("click", async () => {
                await startEditLeader(button.dataset.id);
            });
        });

    leaderList
        .querySelectorAll(".btn-delete")
        .forEach((button) => {
            button.addEventListener("click", async () => {
                if (confirm("Delete this leader?")) {
                    try {
                        await deleteLeader(button.dataset.id);

                        await renderLeadersAdmin();

                        if (
                            editingLeaderId.value ===
                            button.dataset.id
                        ) {
                            resetLeaderForm();
                        }
                    } catch (error) {
                        console.error("Error deleting leader:", error);
                        alert("Could not delete leader. Please try again.");
                    }
                }
            });
        });

    leaderList
        .querySelectorAll(".thumb")
        .forEach((image) => {
            image.addEventListener("click", () => {
                openLightbox(image.src);
            });
        });
}


/* =========================================
   RENDER LEADERS PUBLIC
========================================= */

async function renderLeadersFeed() {
    const leaders = await getLeaders();

    const count = leaders.length;

    leadersFeedCount.textContent =
        count === 0
            ? "0 leaders"
            : count === 1
            ? "1 leader"
            : `${count} leaders`;

    if (count === 0) {
        leadersFeed.innerHTML = `
            <div
                class="news-empty-premium"
                style="grid-column: 1 / -1;"
            >

                <div class="icon">👥</div>

                <h3>
                    No leaders listed yet
                </h3>

                <p>
                    Check back soon for Hruaitute from ZORO.
                </p>

            </div>
        `;

        return;
    }

    leadersFeed.innerHTML = leaders
        .map(
            (leader) => `
            <div class="leader-card-public">

                ${
                    leader.image
                        ? `
                        <img
                            src="${leader.image}"
                            alt="${escapeHtml(
                                leader.name
                            )}"
                            data-full="${leader.image}"
                        >
                    `
                        : `
                        <div
                            style="
                                height: 220px;
                                background: var(--bg);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                opacity: 0.4;
                            "
                        >
                            👥
                        </div>
                    `
                }

                <div class="leader-body">

                    <h3>
                        ${escapeHtml(leader.name)}
                    </h3>

                    <p
                        style="
                            color: var(--accent-hover);
                            font-weight: 500;
                        "
                    >
                        ${escapeHtml(
                            leader.designation || ""
                        )}
                    </p>

                    <p>
                        📞 ${escapeHtml(
                            leader.phone || ""
                        )}
                    </p>

                    <p>
                        📍 ${escapeHtml(
                            leader.address || ""
                        )}
                    </p>

                </div>

            </div>
        `
        )
        .join("");

    leadersFeed
        .querySelectorAll("img")
        .forEach((image) => {
            image.addEventListener("click", () => {
                openLightbox(
                    image.dataset.full || image.src
                );
            });
        });
}


/* =========================================
   RENDER MEMBERS PUBLIC
========================================= */

async function renderMembersFeed() {
    try {
        const members = await getMembers();

        const count = members.length;

        membersFeedCount.textContent =
            count === 0
                ? "0 members"
                : count === 1
                ? "1 member"
                : `${count} members`;

        if (count === 0) {
            membersFeed.innerHTML = `
                <div
                    class="news-empty-premium"
                    style="grid-column: 1 / -1;"
                >

                    <div class="icon">📋</div>

                    <h3>
                        No members listed yet
                    </h3>

                    <p>
                        Check back soon for members of ZORO.
                    </p>

                </div>
            `;

            return;
        }

        membersFeed.innerHTML = members
            .map(
                (member) => `
                <div class="member-card-public">

                    <h3>
                        ${escapeHtml(member.full_name)}
                    </h3>

                    <p>
                        📞 ${escapeHtml(member.phone)}
                    </p>

                    ${
                        member.email
                            ? `
                            <p>
                                ✉️ ${escapeHtml(member.email)}
                            </p>
                        `
                            : ""
                    }

                    ${
                        member.address
                            ? `
                            <p>
                                📍 ${escapeHtml(member.address)}
                            </p>
                        `
                            : ""
                    }

                </div>
            `
            )
            .join("");
    } catch (error) {
        console.error(error);

        membersFeed.innerHTML = `
            <div class="news-empty-premium">

                <div class="icon">⚠️</div>

                <h3>
                    Could not load members
                </h3>

                <p>
                    Please make sure the Django server is running.
                </p>

            </div>
        `;
    }
}


/* =========================================
   PAGE NAVIGATION
========================================= */

function openModal() {
    modal.classList.add("active");

    document.body.style.overflow = "hidden";

    loginError.classList.remove("show");

    loginForm.reset();
}


function closeModal() {
    modal.classList.remove("active");

    document.body.style.overflow = "";
}


async function showAdmin() {

    landing.classList.add("hidden");

    newsPage.classList.remove("active");
    galleryPage.classList.remove("active");
    leadersPage.classList.remove("active");
    membersPage.classList.remove("active");

    admin.classList.add("active");

    closeModal();

    try {
        await renderMembers();
        console.log("Members loaded");
    } catch (error) {
        console.error("Members error:", error);
    }

    try {
        await renderNewsAdmin();
        console.log("News loaded");
    } catch (error) {
        console.error("News error:", error);
    }

    try {
        await renderPhotosAdmin();
        console.log("Photos loaded");
    } catch (error) {
        console.error("Photos error:", error);
    }

    try {
        await renderLeadersAdmin();
        console.log("Leaders loaded");
    } catch (error) {
        console.error("Leaders error:", error);
    }
        try {
        await getEnquiries();
        console.log("Enquiries loaded");
    } catch (error) {
        console.error("Enquiries error:", error);
    }

    sessionStorage.setItem(
        "zoro_logged_in",
        "true"
    );
}

function showLanding() {
    admin.classList.remove("active");

    newsPage.classList.remove("active");
    galleryPage.classList.remove("active");
    leadersPage.classList.remove("active");
    membersPage.classList.remove("active");

    landing.classList.remove("hidden");

    sessionStorage.removeItem(
        "zoro_logged_in"
    );
}


function showNewsConsole() {
    landing.classList.add("hidden");

    admin.classList.remove("active");
    galleryPage.classList.remove("active");
    leadersPage.classList.remove("active");
    membersPage.classList.remove("active");

    newsPage.classList.add("active");

    renderNewsFeed();

    window.scrollTo(0, 0);
}


function showGallery() {
    landing.classList.add("hidden");

    admin.classList.remove("active");
    newsPage.classList.remove("active");
    leadersPage.classList.remove("active");
    membersPage.classList.remove("active");

    galleryPage.classList.add("active");

    renderGalleryFeed();

    window.scrollTo(0, 0);
}


function showLeaders() {
    landing.classList.add("hidden");

    admin.classList.remove("active");
    newsPage.classList.remove("active");
    galleryPage.classList.remove("active");
    membersPage.classList.remove("active");

    leadersPage.classList.add("active");

    renderLeadersFeed();

    window.scrollTo(0, 0);
}


function showMembers() {
    landing.classList.add("hidden");

    admin.classList.remove("active");
    newsPage.classList.remove("active");
    galleryPage.classList.remove("active");
    leadersPage.classList.remove("active");

    membersPage.classList.add("active");

    renderMembersFeed();

    window.scrollTo(0, 0);
}


/* =========================================
   AUTO LOGIN
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        if (
            sessionStorage.getItem(
                "zoro_logged_in"
            ) === "true"
        ) {

            await showAdmin();

        } else {

            showLanding();

        }

    }
);


/* =========================================
   LOGIN EVENTS
========================================= */

openBtn.addEventListener(
    "click",
    openModal
);

closeBtn.addEventListener(
    "click",
    closeModal
);

cancelBtn.addEventListener(
    "click",
    closeModal
);

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

document.addEventListener("keydown", (e) => {
    if (
        e.key === "Escape" &&
        modal.classList.contains("active")
    ) {
        closeModal();
    }
});


loginForm.addEventListener(
    "submit",
    (e) => {
        e.preventDefault();

        const username =
            document
                .getElementById("username")
                .value
                .trim();

        const password =
            document
                .getElementById("password")
                .value;

        if (
            username === ADMIN_USER &&
            password === ADMIN_PASS
        ) {
            showAdmin();
        } else {
            loginError.classList.add("show");
        }
    }
);


logoutBtn.addEventListener(
    "click",
    showLanding
);


/* =========================================
   ADD MEMBER
========================================= */

memberForm.addEventListener(
    "submit",
    async (e) => {
        e.preventDefault();

        try {
            await addMember({
                full_name:
                    document
                        .getElementById("memberName")
                        .value
                        .trim(),

                phone:
                    document
                        .getElementById("memberPhone")
                        .value
                        .trim(),

                email: "",

                address:
                    document
                        .getElementById("memberAddress")
                        .value
                        .trim(),
            });

            await renderMembers();

            memberForm.reset();

            successToast.classList.add("show");

            setTimeout(() => {
                successToast.classList.remove(
                    "show"
                );
            }, 2500);

        } catch (error) {
            console.error(error);

            alert(
                "Could not add member. Please make sure the Django server is running."
            );
        }
    }
);


/* =========================================
   NEWS FORM
========================================= */
newsForm.addEventListener(
    "submit",
    async (e) => {
        e.preventDefault();

        const title =
            document
                .getElementById("newsTitle")
                .value
                .trim();

        const content =
            document
                .getElementById("newsContent")
                .value
                .trim();

        const formData = new FormData();

        formData.append("title", title);
        formData.append("content", content);


        // Add image if selected
        if (
            newsImageInput.files &&
            newsImageInput.files[0]
        ) {
            formData.append(
                "image",
                newsImageInput.files[0]
            );
        }


        // Add PDF if selected
        if (currentPdfFile) {
            formData.append(
                "pdf",
                currentPdfFile
            );
        }


        const editId =
            editingNewsId.value;

        try {

            if (editId) {

                await updateNewsApi(
                    editId,
                    formData
                );

                newsSuccessToast.textContent =
                    "News updated successfully!";

            } else {

                await createNews(
                    formData
                );

                newsSuccessToast.textContent =
                    "News published successfully!";
            }


            await renderNewsAdmin();

            resetNewsForm();

            newsSuccessToast.classList.add(
                "show"
            );

            setTimeout(() => {
                newsSuccessToast.classList.remove(
                    "show"
                );
            }, 2500);

        } catch (error) {

            console.error(error);

            alert(
                "Could not publish news. Please make sure the Django server is running."
            );
        }
    }
);


newsCard.addEventListener(
    "click",
    showNewsConsole
);

backFromNews.addEventListener(
    "click",
    showLanding
);


/* =========================================
   PHOTO FORM
========================================= */

photoForm.addEventListener(
    "submit",
    async (e) => {
        e.preventDefault();

        const editId =
            editingPhotoId.value;

        if (
            !photoImageInput.files[0] &&
            !editId
        ) {
            alert(
                "Please select a photo to upload."
            );

            return;
        }

        const description =
            document
                .getElementById(
                    "photoDescription"
                )
                .value
                .trim();

        const formData = new FormData();

        formData.append("description", description);

        // Only append the image if a new file was chosen —
        // otherwise leave it out so the existing Cloudinary
        // image on the server is left untouched.
        if (
            photoImageInput.files &&
            photoImageInput.files[0]
        ) {
            formData.append(
                "image",
                photoImageInput.files[0]
            );
        }

        try {
            if (editId) {
                await updatePhoto(editId, formData);

                photoSuccessToast.textContent =
                    "Photo updated successfully!";
            } else {
                await addPhoto(formData);

                photoSuccessToast.textContent =
                    "Photo uploaded successfully!";
            }

            await renderPhotosAdmin();

            resetPhotoForm();

            photoSuccessToast.classList.add(
                "show"
            );

            setTimeout(() => {
                photoSuccessToast.classList.remove(
                    "show"
                );
            }, 2500);
        } catch (error) {
            console.error(error);

            alert(
                "Could not upload photo. Please make sure the Django server is running."
            );
        }
    }
);


galleryCard.addEventListener(
    "click",
    showGallery
);

backFromGallery.addEventListener(
    "click",
    showLanding
);


/* =========================================
   LEADER FORM
========================================= */

leaderForm.addEventListener(
    "submit",
    async (e) => {
        e.preventDefault();

        const editId =
            editingLeaderId.value;

        const name =
            document
                .getElementById("leaderName")
                .value
                .trim();

        const designation =
            document
                .getElementById(
                    "leaderDesignation"
                )
                .value
                .trim();

        const phone =
            document
                .getElementById("leaderPhone")
                .value
                .trim();

        const address =
            document
                .getElementById(
                    "leaderAddress"
                )
                .value
                .trim();

        const formData = new FormData();

        formData.append("name", name);
        formData.append("designation", designation);
        formData.append("phone", phone);
        formData.append("address", address);

        // Only append the image if a new file was chosen —
        // otherwise leave it out so the existing Cloudinary
        // image on the server is left untouched.
        if (
            leaderImageInput.files &&
            leaderImageInput.files[0]
        ) {
            formData.append(
                "image",
                leaderImageInput.files[0]
            );
        }

        try {
            if (editId) {
                await updateLeader(editId, formData);

                leaderSuccessToast.textContent =
                    "Leader updated successfully!";
            } else {
                await addLeader(formData);

                leaderSuccessToast.textContent =
                    "Leader added successfully!";
            }

            await renderLeadersAdmin();

            resetLeaderForm();

            leaderSuccessToast.classList.add(
                "show"
            );

            setTimeout(() => {
                leaderSuccessToast.classList.remove(
                    "show"
                );
            }, 2500);
        } catch (error) {
            console.error(error);

            alert(
                "Could not save leader. Please make sure the Django server is running."
            );
        }
    }
);


leadersCard.addEventListener(
    "click",
    showLeaders
);

backFromLeaders.addEventListener(
    "click",
    showLanding
);


membersCard.addEventListener(
    "click",
    showMembers
);

backFromMembers.addEventListener(
    "click",
    showLanding
);
getInTouchBtn.addEventListener("click", (event) => {

    event.preventDefault();

    landing.classList.add("hidden");

    newsPage.classList.remove("active");
    galleryPage.classList.remove("active");
    leadersPage.classList.remove("active");
    membersPage.classList.remove("active");

    contactPage.classList.add("active");

});
// =========================
// CONTACT PAGE
// =========================

contactNavBtn.addEventListener("click", () => {

    landing.classList.add("hidden");

    newsPage.classList.remove("active");
    galleryPage.classList.remove("active");
    leadersPage.classList.remove("active");
    membersPage.classList.remove("active");
    admin.classList.remove("active");

    contactPage.classList.add("active");

});


backFromContact.addEventListener("click", () => {

    contactPage.classList.remove("active");

    landing.classList.remove("hidden");

});
// ================================
// ADMIN NAVIGATION TABS
// ================================

document.addEventListener("DOMContentLoaded", function () {

    const navButtons = document.querySelectorAll(".admin-nav button");

    navButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const targetId = button.getAttribute("data-target");

            const targetPanel = document.getElementById(targetId);

            if (!targetPanel) {
                console.error("Section not found:", targetId);
                return;
            }

            // Hide every tab panel, then show only the one that was clicked
            document
                .querySelectorAll(".admin-tab-panel")
                .forEach(function (panel) {
                    panel.classList.remove("active");
                });

            targetPanel.classList.add("active");

            // Highlight the clicked nav button, un-highlight the rest
            navButtons.forEach(function (btn) {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            window.scrollTo({ top: 0, behavior: "smooth" });

        });

    });

    // Mark the first tab (Members) as the active button on initial load
    if (navButtons.length > 0) {
        navButtons[0].classList.add("active");
    }

});


// ================================
// ADMIN SUBVIEWS (Upload <-> List) via glass buttons
// ================================

function switchAdminSubview(targetId) {
    const target = document.getElementById(targetId);

    if (!target) {
        console.error("Subview not found:", targetId);
        return;
    }

    const panel = target.closest(".admin-tab-panel");

    if (!panel) return;

    panel
        .querySelectorAll(".admin-subview")
        .forEach(function (subview) {
            subview.classList.remove("active");
        });

    target.classList.add("active");

    panel.scrollTo ? panel.scrollTo({ top: 0 }) : null;
}

document.addEventListener("DOMContentLoaded", function () {

    document
        .querySelectorAll(".admin-goto-list, .admin-goto-upload")
        .forEach(function (button) {
            button.addEventListener("click", function () {
                switchAdminSubview(button.getAttribute("data-target"));
            });
        });

});


// ================================
// ADMIN SEARCH BOXES (client-side filter over rendered list cards)
// ================================

function wireAdminSearch(inputEl, listEl) {
    if (!inputEl || !listEl) return;

    inputEl.addEventListener("input", function () {
        const term = inputEl.value.trim().toLowerCase();

        listEl
            .querySelectorAll(":scope > div:not(.empty-state)")
            .forEach(function (card) {
                const matches = card.textContent
                    .toLowerCase()
                    .includes(term);

                card.style.display = matches ? "" : "none";
            });
    });
}

document.addEventListener("DOMContentLoaded", function () {
    wireAdminSearch(
        document.getElementById("memberSearchInput"),
        membersList
    );

    wireAdminSearch(
        document.getElementById("newsSearchInput"),
        newsList
    );

    wireAdminSearch(
        document.getElementById("photoSearchInput"),
        photoList
    );

    wireAdminSearch(
        document.getElementById("leaderSearchInput"),
        leaderList
    );
});
// =========================
// CONTACT ENQUIRY FORM
// =========================

contactForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const enquiryData = {
        name: contactName.value,
        email: contactEmail.value,
        phone: contactPhone.value,
        subject: contactSubject.value,
        message: contactMessage.value
    };

    try {

        const response = await fetch(
            `${API_BASE}/enquiries/`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(enquiryData)
            }
        );
        if (!response.ok) {
            throw new Error("Failed to send enquiry");
        }

        contactForm.reset();

        contactSuccessToast.classList.add("show");

        setTimeout(() => {
            contactSuccessToast.classList.remove("show");
        }, 3000);

    } catch (error) {

        console.error("Enquiry error:", error);

        alert(
            "Unable to send your enquiry. Please try again."
        );

    }

});
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}

const adminMenuToggle = document.getElementById("adminMenuToggle");
const adminNavWrapper = document.getElementById("adminNavWrapper");

if (adminMenuToggle && adminNavWrapper) {
    adminMenuToggle.addEventListener("click", () => {
        adminNavWrapper.classList.toggle("active");
    });

    // Close the dropdown once a nav button or logout is tapped
    adminNavWrapper
        .querySelectorAll("button")
        .forEach((button) => {
            button.addEventListener("click", () => {
                adminNavWrapper.classList.remove("active");
            });
        });
}
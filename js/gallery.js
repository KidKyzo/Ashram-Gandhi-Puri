const galleryData = [
    {
        image: "../assets/activity-gallery-4.jpg",
        title: "Meeting with Japa Malamitra Partner",
        date: "2026-04",
        date_display: "April 2026",
        description: "The Founder of Ashram Gandhi Puri held a meeting and discussion with the Japa Malamitra partner in Ashram Gandhi Puri Klungkung.",
        source: "https://www.facebook.com/photo/?fbid=2173525370152628&set=a.2106933593478473"
    },
    {
        image: "../assets/activity-gallery-9.jpg",
        title: "Briefing and Meetings with Ashram Gandhi Puri members",
        date: "2026-04",
        date_display: "April 2026",
        description: "Holding regular meetings with Ashram Gandhi Puri members to hear their stories and discuss issues.",
        source: "https://www.facebook.com/photo/?fbid=2172735710231594&set=a.2149182732586892"
    },
    {
        image: "../assets/activity-gallery-8.jpg",
        title: "Self Retreat with GuruJi Rasik Varagi",
        date: "2026-04",
        date_display: "April 2026",
        description: "Self Retreat activities with GuruJi Rasik Varagi were held at the Ashram Gandhi Puri community.",
        source: "https://www.facebook.com/photo/?fbid=2161938091311356&set=a.2106982273473605"
    },
    {
        image: "../assets/activity-gallery-2.jpg",
        title: "Vishramapuri Volunteer Program 2025",
        date: "2025-12",
        date_display: "December 2025",
        description: "Conducting Yoga and Dharma Talk activities with Dr. Achrya Naresh Ji in the Vishramapuri Volunteer Program 2025.",
        source: "https://www.facebook.com/photo/?fbid=2056297878542045&set=a.2044874456351054"
    },
    {
        image: "../assets/activity-gallery-3.jpg",
        title: "100 Hour Yoga Teacher Training Course",
        date: "2025-12",
        date_display: "December 2025",
        description: "Ashram Gandhi Puri held a 100 Hour Yoga Teacher Training Course. This activity was attended by 30 participants from various regions.",
        source: "https://www.facebook.com/photo/?fbid=2061142884724211&set=a.2044874456351054"
    },
    {
        image: "../assets/activity-gallery-7.jpg",
        title: "Inauguration of the Acharya Vinoba Bhave Statue",
        date: "2025-09",
        date_display: "September 2025",
        description: "Inauguration of the Acharya Vinoba Bhave Statue during the celebration of the 28th anniversary of the founding of Ashram Gandhi Puri.",
        source: "https://lenteraesai.id/2025/09/06/perayaan-28-tahun-ashram-gandhi-puri-satukan-spiritualitas-budaya-dan-kemanusiaan/"
    },
    {
        image: "../assets/activity-gallery-6.webp",
        title: "Ashram Gandhi Puri Sevagram Holds Mass Yoga",
        date: "2025-06",
        date_display: "June 2025",
        description: "Ashram Gandhi Puri Sevagram Klungkung Holds Sanggam Yoga 2025, presenting Anjasmara Prasetya as an instructor which is a series of Yoga and Dharma Talk activities with Dr. Achrya Naresh Ji in the Vishramapuri Volunteer Program 2025.",
        source: "https://craddha.com/ashram-gandhi-puri-rayakan-10-tahun-aliansi-yoga-indonesia/"
    },
    {
        image: "../assets/hero-photo-2.jpg",
        title: "Planting 1000 Trees Activity",
        date: "2024-11",
        date_display: "November 2024",
        description: "Ashram Gandhi Puri held a planting activity of 1000 trees to welcome the 2025 New Year. This activity aims to preserve the environment and provide benefits for the community.",
        source: "https://laksara.id/2024/10/29/serangkaian-hut-ke-27-1-000-pohon-ditanam-di-ashram-gandhi-puri/"
    }
];

// DOM elements from gallery
const gallerylist = document.getElementById("gallery-container");
const galleryStatus = document.getElementById("gallery-status");
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');

// Escape text before putting it in markup
function escapeHTML(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
}

const ICON_CALENDAR = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>';
const ICON_ARROW = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

// Build the cards (markup + CSS classes live in css/gallery.css)
function renderGallery(dataToRender) {
    gallerylist.innerHTML = "";

    if (dataToRender.length === 0) {
        gallerylist.innerHTML = `
        <div class="gallery-empty">
            <h2>No activities found</h2>
            <p>Try a different search term to see more of our activities.</p>
        </div>`;
        return;
    }

    dataToRender.forEach(function (item) {
        const cardHTML = `
        <a href="${item.source}" target="_blank" rel="noopener noreferrer" class="gallery-card">
            <div class="gallery-card__media">
                <img src="${item.image}" alt="" width="800" height="500" loading="lazy" />
            </div>
            <div class="gallery-card__body">
                <span class="gallery-card__meta">
                    ${ICON_CALENDAR}
                    <time datetime="${item.date}">${escapeHTML(item.date_display)}</time>
                </span>
                <h3 class="gallery-card__title">${escapeHTML(item.title)}</h3>
                <p class="gallery-card__text">${escapeHTML(item.description)}</p>
                <span class="gallery-card__more">
                    Read the story<span class="sr-only"> (opens in a new tab)</span>
                    ${ICON_ARROW}
                </span>
            </div>
        </a>
        `;

        gallerylist.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// update + filter + sorting
function updateGallery() {
    // Take search and sort data from DOM element
    const searchTerm = searchInput.value.trim().toLowerCase();
    const sortValue = sortSelect.value;
    // Filter data
    const filteredData = galleryData.filter(function (item) {
        return item.title.toLowerCase().includes(searchTerm);
    });
    // Sorting data
    if (sortValue === 'newest') {
        filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    else {
        filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    renderGallery(filteredData);

    // Announce the result count to assistive tech
    if (galleryStatus) {
        galleryStatus.textContent =
            "Showing " + filteredData.length + " of " + galleryData.length + " activities";
    }
}

// Listening events
searchInput.addEventListener('input', updateGallery);
sortSelect.addEventListener('change', updateGallery);

// Initial render
updateGallery();
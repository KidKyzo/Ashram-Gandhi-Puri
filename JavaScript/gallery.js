const galleryData = [
    {
        image: "../assets/Activity and GAllery 4.jpg",
        title: "Meeting with Japa Malamitra Partner",
        date: "2026-04",
        date_display: "April 2026",
        description: "The Founder of Ashram Gandhi Puri held a meeting and discussion with the Japa Malamitra partner in Ashram Gandhi Puri Klungkung.",
    },
    {
        image: "../assets/Activity and Gallery 9.jpg",
        title: "Briefing and Meetings with Ashram Gandhi Puri members",
        date: "2026-04",
        date_display: "April 2026",
        description: "Holding regular meetings with Ashram Gandhi Puri members to hear their stories and discuss issues.",
    },
    {
        image: "../assets/Activity and Gallery 8.jpg",
        title: "Self Retreat with GuruJi Rasik Varagi",
        date: "2026-04",
        date_display: "April 2026",
        description: "Self Retreat activities with GuruJi Rasik Varagi were held at the Ashram Gandhi Puri community.",
    },
    {
        image: "../assets/Activity and Gallery 2.jpg",
        title: "Vishramapuri Volunteer Program 2025",
        date: "2025-12",
        date_display: "December 2025",
        description: "Conducting Yoga and Dharma Talk activities with Dr. Achrya Naresh Ji in the Vishramapuri Volunteer Program 2025.",
    },
    {
        image: "../assets/Acticity and Gallery 3.jpg",
        title: "100 Hour Yoga Teacher Training Course",
        date: "2025-12",
        date_display: "December 2025",
        description: "Ashram Gandhi Puri held a 100 Hour Yoga Teacher Training Course. This activity was attended by 30 participants from various regions.",
    },
    {
        image: "../assets/Activity and Gallery 7.jpg",
        title: "Inauguration of the Acharya Vinoba Bhave Statue",
        date: "2025-09",
        date_display: "September 2025",
        description: "Inauguration of the Acharya Vinoba Bhave Statue during the celebration of the 28th anniversary of the founding of Ashram Gandhi Puri.",
    },
    {
        image: "../assets/Activity and Gallery 6.webp",
        title: "Ashram Gandhi Puri Sevagram Holds Mass Yoga",
        date: "2025-06",
        date_display: "June 2025",
        description: "Ashram Gandhi Puri Sevagram Klungkung Holds Sanggam Yoga 2025, presenting Anjasmara Prasetya as an instructor which is a series of Yoga and Dharma Talk activities with Dr. Achrya Naresh Ji in the Vishramapuri Volunteer Program 2025.",
    },
    {
        image: "../assets/Hero Photo 2.jpg",
        title: "Planting 1000 Trees Activity",
        date: "2024-11",
        date_display: "November 2024",
        description: "Ashram Gandhi Puri held a planting activity of 1000 trees to welcome the 2025 New Year. This activity aims to preserve the environment and provide benefits for the community."
    }
];
// DOM element from gallery
const gallerylist = document.getElementById("gallery-container");

// take data + css matching
function renderGallery(dataToRender) {
    gallerylist.innerHTML = "";

    dataToRender.forEach(function (item) {
        const cardHTML = `
        <div class="gallery-card">
            <img src="${item.image}" alt="${item.title}"/>
            <div class="gallery-info">
            <h3>${item.title}</h3>
            <span class="gallery-date">${item.date_display}</span>
            <p>${item.description}</p>
            </div>
        </div>
        `;

        gallerylist.insertAdjacentHTML('beforeend', cardHTML);
    })
}




function updateGallery() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const sortValue = document.getElementById('sort-select').value;

    const filteredData = galleryData.filter(function (item) {
        return item.title.toLocaleLowerCase().includes(searchTerm);
    });
    if (sortValue === 'newest') {
        filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    else {
        filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    renderGallery(filteredData);
}


const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');

searchInput.addEventListener('input', updateGallery);
sortSelect.addEventListener('change', updateGallery);


updateGallery();
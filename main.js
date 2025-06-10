document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    let allVns = [];
    let currentFilter = 'All';

    // --- DOM Elements ---
    const vnListContainer = document.getElementById('vn-list-container');
    const categoryList = document.getElementById('category-list');
    const searchInput = document.getElementById('search-input');
    const drawerToggle = document.getElementById('drawer-toggle');
    const categoryDrawer = document.getElementById('category-drawer');
    const modalContainer = document.getElementById('modal-container');
    const modalBody = document.getElementById('modal-body');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    // --- Data Fetching ---
    async function fetchData() {
        try {
            const response = await fetch('main.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allVns = await response.json();
            initializeApp();
        } catch (error) {
            console.error("Could not fetch VN data:", error);
            vnListContainer.innerHTML = "<p>数据加载失败，请检查网络或联系管理员。</p>";
        }
    }

    // --- Initialization ---
    function initializeApp() {
        renderCategories();
        renderVnList();
        setupEventListeners();
    }

    // --- Rendering Functions ---
    function renderVnList() {
        // Fade out for smooth transition
        vnListContainer.style.opacity = '0';

        setTimeout(() => {
            const query = searchInput.value.toLowerCase();
            const filteredVns = allVns.filter(vn => {
                const matchesCategory = currentFilter === 'All' || vn.tags.includes(currentFilter);
                const matchesSearch = vn.title_translated.toLowerCase().includes(query) || vn.title_original.toLowerCase().includes(query);
                return matchesCategory && matchesSearch;
            });

            vnListContainer.innerHTML = ''; // Clear previous list
            if (filteredVns.length === 0) {
                vnListContainer.innerHTML = '<p class="no-results">没有找到匹配的结果。</p>';
            } else {
                filteredVns.forEach(vn => {
                    const card = createVnCard(vn);
                    vnListContainer.appendChild(card);
                });
            }
            // Fade in the new list
            vnListContainer.style.opacity = '1';
        }, 200);
    }

    function createVnCard(vn) {
        const card = document.createElement('div');
        card.className = 'vn-card';
        card.dataset.id = vn.id;

        const tagsHtml = vn.tags.map(tag => `<span class="vn-tag">${tag}</span>`).join('');
        
        // Generate star rating HTML
        let starsHtml = '';
        const fullStars = Math.round(vn.rating_overall);
        for (let i = 1; i <= 10; i++) {
            starsHtml += `<span class="star ${i <= fullStars ? '' : 'empty'}">★</span>`;
        }

        card.innerHTML = `
            <img src="${vn.cover_image}" alt="${vn.title_translated} Cover" class="vn-card-cover">
            <div class="vn-card-content">
                <h3 class="vn-title-translated">${vn.title_translated}</h3>
                <p class="vn-title-original">${vn.title_original}</p>
                <p class="vn-company">${vn.company}</p>
                <div class="vn-tags">${tagsHtml}</div>
                
                <div class="vn-card-footer">
                    <div class="vn-rating" data-action="show-rating">
                        <div class="stars-container">${starsHtml}</div>
                        <span class="rating-score">${vn.rating_overall.toFixed(1)}</span>
                    </div>
                    <p class="vn-review-short" data-action="show-review">${vn.review_short}</p>
                </div>
            </div>
        `;
        return card;
    }

    function renderCategories() {
        const allTags = new Set(allVns.flatMap(vn => vn.tags));
        categoryList.innerHTML = '<button class="category-btn active" data-category="All">全部</button>';
        allTags.forEach(tag => {
            const btn = document.createElement('button');
            btn.className = 'category-btn';
            btn.dataset.category = tag;
            btn.textContent = tag;
            categoryList.appendChild(btn);
        });
    }

    // --- Modal Logic ---
    function openModal(content) {
        modalBody.innerHTML = content;
        modalContainer.style.display = 'flex';
        setTimeout(() => modalContainer.classList.add('visible'), 10); // For transition
    }

    function closeModal() {
        modalContainer.classList.remove('visible');
        setTimeout(() => {
            modalContainer.style.display = 'none';
            modalBody.innerHTML = '';
        }, 300); // Match CSS transition duration
    }

    function showRatingModal(vn) {
        const detailsHtml = Object.entries(vn.rating_details)
            .map(([key, value]) => `
                <div class="rating-item">
                    <span class="rating-label">${key}</span>
                    <span class="rating-value">${value} / 10</span>
                </div>
            `).join('');

        const modalContent = `
            <div class="modal-rating-details">
                <h3>${vn.title_translated} - 详细评分</h3>
                ${detailsHtml}
            </div>
        `;
        openModal(modalContent);
    }

    function showReviewModal(vn) {
        const modalContent = `
            <div class="modal-review-full">
                <h3>${vn.title_translated} - 详细评测</h3>
                <p class="review-full-text">${vn.review_full}</p>
            </div>
        `;
        openModal(modalContent);
    }

    // --- Event Listeners ---
    function setupEventListeners() {
        // Search
        searchInput.addEventListener('input', renderVnList);

        // Drawer Toggle
        drawerToggle.addEventListener('click', () => {
            const isOpen = categoryDrawer.classList.toggle('open');
            document.body.classList.toggle('drawer-open', isOpen);
            document.querySelector('.main-header').classList.toggle('drawer-open', isOpen);
        });
        
        // Category Filtering
        categoryList.addEventListener('click', (e) => {
            if (e.target.matches('.category-btn')) {
                currentFilter = e.target.dataset.category;
                document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                renderVnList();
                // Close drawer after selection on smaller screens
                if (window.innerWidth <= 768) {
                    categoryDrawer.classList.remove('open');
                    document.body.classList.remove('drawer-open');
                    document.querySelector('.main-header').classList.remove('drawer-open');
                }
            }
        });

        // Modal triggers (using event delegation)
        vnListContainer.addEventListener('click', (e) => {
            const targetElement = e.target;
            const card = targetElement.closest('.vn-card');
            if (!card) return;

            const vnId = parseInt(card.dataset.id, 10);
            const vn = allVns.find(v => v.id === vnId);
            if (!vn) return;

            const actionTarget = targetElement.closest('[data-action]');
            if (!actionTarget) return;

            const action = actionTarget.dataset.action;
            if (action === 'show-rating') {
                showRatingModal(vn);
            } else if (action === 'show-review') {
                showReviewModal(vn);
            }
        });

        // Modal Closing
        modalCloseBtn.addEventListener('click', closeModal);
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                closeModal();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalContainer.classList.contains('visible')) {
                closeModal();
            }
        });
    }

    // --- Start the application ---
    fetchData();
});
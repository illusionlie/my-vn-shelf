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
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;
    const mainHeader = document.querySelector('.main-header');
    const moreMenuToggle = document.getElementById('more-menu-toggle');
    const moreMenu = document.getElementById('more-menu');

    // --- Theme Management ---
    const ICONS = {
        light: `<svg fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><g><path fill="currentColor" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" d="M25,16c4.963,0,9,4.038,9,9c0,4.963-4.037,9-9,9c-4.962,0-9-4.037-9-9C16,20.038,20.038,16,25,16"/></g><line fill="currentColor" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" x1="25" y1="45" x2="25" y2="39"/><line fill="currentColor" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" x1="25" y1="11" x2="25" y2="5"/><line fill="currentColor" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" x1="5" y1="25" x2="11" y2="25"/><line fill="currentColor" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" x1="39" y1="25" x2="45" y2="25"/><line fill="currentColor" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" x1="10.858" y1="39.143" x2="15.101" y2="34.9"/><line fill="currentColor" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" x1="34.899" y1="15.102" x2="39.143" y2="10.858"/><line fill="currentColor" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" x1="10.858" y1="10.858" x2="15.101" y2="15.102"/><line fill="currentColor" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" x1="34.899" y1="34.9" x2="39.143" y2="39.143"/></svg>`,
        dark: `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M19.9001 2.30719C19.7392 1.8976 19.1616 1.8976 19.0007 2.30719L18.5703 3.40247C18.5212 3.52752 18.4226 3.62651 18.298 3.67583L17.2067 4.1078C16.7986 4.26934 16.7986 4.849 17.2067 5.01054L18.298 5.44252C18.4226 5.49184 18.5212 5.59082 18.5703 5.71587L19.0007 6.81115C19.1616 7.22074 19.7392 7.22074 19.9001 6.81116L20.3305 5.71587C20.3796 5.59082 20.4782 5.49184 20.6028 5.44252L21.6941 5.01054C22.1022 4.849 22.1022 4.26934 21.6941 4.1078L20.6028 3.67583C20.4782 3.62651 20.3796 3.52752 20.3305 3.40247L19.9001 2.30719Z"/><path d="M16.0328 8.12967C15.8718 7.72009 15.2943 7.72009 15.1333 8.12967L14.9764 8.52902C14.9273 8.65407 14.8287 8.75305 14.7041 8.80237L14.3062 8.95987C13.8981 9.12141 13.8981 9.70107 14.3062 9.86261L14.7041 10.0201C14.8287 10.0694 14.9273 10.1684 14.9764 10.2935L15.1333 10.6928C15.2943 11.1024 15.8718 11.1024 16.0328 10.6928L16.1897 10.2935C16.2388 10.1684 16.3374 10.0694 16.462 10.0201L16.8599 9.86261C17.268 9.70107 17.268 9.12141 16.8599 8.95987L16.462 8.80237C16.3374 8.75305 16.2388 8.65407 16.1897 8.52902L16.0328 8.12967Z"/><path d="M21.0672 11.8568L20.4253 11.469L21.0672 11.8568ZM12.1432 2.93276L11.7553 2.29085V2.29085L12.1432 2.93276ZM21.25 12C21.25 17.1086 17.1086 21.25 12 21.25V22.75C17.9371 22.75 22.75 17.9371 22.75 12H21.25ZM12 21.25C6.89137 21.25 2.75 17.1086 2.75 12H1.25C1.25 17.9371 6.06294 22.75 12 22.75V21.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75V1.25C6.06294 1.25 1.25 6.06294 1.25 12H2.75ZM15.5 14.25C12.3244 14.25 9.75 11.6756 9.75 8.5H8.25C8.25 12.5041 11.4959 15.75 15.5 15.75V14.25ZM20.4253 11.469C19.4172 13.1373 17.5882 14.25 15.5 14.25V15.75C18.1349 15.75 20.4407 14.3439 21.7092 12.2447L20.4253 11.469ZM9.75 8.5C9.75 6.41182 10.8627 4.5828 12.531 3.57467L11.7553 2.29085C9.65609 3.5593 8.25 5.86509 8.25 8.5H9.75ZM12 2.75C11.9115 2.75 11.8077 2.71008 11.7324 2.63168C11.6686 2.56527 11.6538 2.50244 11.6503 2.47703C11.6461 2.44587 11.6482 2.35557 11.7553 2.29085L12.531 3.57467C13.0342 3.27065 13.196 2.71398 13.1368 2.27627C13.0754 1.82126 12.7166 1.25 12 1.25V2.75ZM21.7092 12.2447C21.6444 12.3518 21.5541 12.3539 21.523 12.3497C21.4976 12.3462 21.4347 12.3314 21.3683 12.2676C21.2899 12.1923 21.25 12.0885 21.25 12H22.75C22.75 11.2834 22.1787 10.9246 21.7237 10.8632C21.286 10.804 20.7293 10.9658 20.4253 11.469L21.7092 12.2447Z"/></svg>`
    };

    function applyTheme(theme) {
        if (theme === 'light') {
            body.classList.add('light-mode');
            themeToggleBtn.innerHTML = ICONS.dark;
        } else {
            body.classList.remove('light-mode');
            themeToggleBtn.innerHTML = ICONS.light;
        }
        localStorage.setItem('theme', theme);
    }

    function toggleTheme() {
        const currentTheme = body.classList.contains('light-mode') ? 'light' : 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    }

    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            applyTheme(savedTheme);
        } else {
            const hours = new Date().getHours();
            // 6 AM to 6 PM (18:00) is light mode
            const isDayTime = hours >= 6 && hours < 18;
            applyTheme(isDayTime ? 'light' : 'dark');
        }
    }

    // --- Data Fetching ---
    async function fetchData() {
        try {
            const response = await fetch('/main.json');
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
            <div class="vn-cover-container">
                <a href="/images/${vn.cover_image}" data-caption="${vn.title_translated}">
                    <img src="/images/thumbnails/${vn.cover_image}" alt="${vn.title_translated} Cover" class="vn-card-cover" loading="lazy">
                    ${vn.all_ages ? '<span class="vn-cover-badge">全年龄</span>' : ''}
                </a>
            </div>
            <div class="vn-card-content">
                <a href="${vn.vndb_url}" target="_blank" rel="noopener noreferrer" class="vn-title-link">
                    <h3 class="vn-title-translated">${vn.title_translated}</h3>
                </a>
                <p class="vn-title-original">${vn.title_original}</p>
                <p class="vn-company">${vn.company}</p>
                <div class="vn-tags">${tagsHtml}</div>
                
                <div class="vn-card-footer">
                    <div class="vn-rating" data-action="show-rating">
                        <div class="stars-container">${starsHtml}</div>
                        <span class="rating-score">${vn.rating_overall.toFixed(1)}</span>
                        <span class="time-length">| ⏱️${vn.time_length}小时</span>
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

    // --- Drawer Logic ---
    function closeDrawer() {
        if (categoryDrawer.classList.contains('open')) {
            categoryDrawer.classList.remove('open');
            body.classList.remove('drawer-open');
            mainHeader.classList.remove('drawer-open');
        }
    }

    function closeMoreMenu() {
        if (moreMenu.classList.contains('open')) {
            moreMenu.classList.remove('open');
        }
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
        const parsedReviewHtml = parseReviewContent(vn.review_full);
        
        const modalContent = `
            <div class="modal-review-full">
                <h3>${vn.title_translated} - 详细评测</h3>
                <div class="review-content-body">
                    ${parsedReviewHtml}
                </div>
            </div>
        `;
        openModal(modalContent);
    }

    // A lightweight parser for review content
    function parseReviewContent(text) {
        if (!text) return '';

        const lines = text.split('\n');
        
        const htmlParts = lines.map(line => {
            const trimmedLine = line.trim();

            if (trimmedLine === '') {
                return ''; // Skip empty lines
            }

            // Check for \line separator
            if (trimmedLine === '\\line') {
                return '<hr class="review-separator">';
            }

            // Check for \img tag using regex
            const imgRegex = /^\\img\[(.*?)(?:\|(.*?))?\]$/;
            const imgMatch = trimmedLine.match(imgRegex);
            if (imgMatch) {
                const src = imgMatch[1];
                const alt = imgMatch[2] || '评测图片'; // Provide a default alt text
                return `<img src="${src}" alt="${alt}" class="review-image" loading="lazy">`;
            }

            // Otherwise, it's a paragraph of text
            return `<p class="review-full-text">${trimmedLine}</p>`;
        });

        return htmlParts.join('');
    }

    // --- Event Listeners ---
    function setupEventListeners() {
        // Theme Toggle
        themeToggleBtn.addEventListener('click', toggleTheme);

        // Search
        searchInput.addEventListener('input', renderVnList);

        // Drawer Toggle
        drawerToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent this click from being caught by the document listener
            const isOpen = categoryDrawer.classList.toggle('open');
            body.classList.toggle('drawer-open', isOpen);
            mainHeader.classList.toggle('drawer-open', isOpen);
        });
        
        // Category Filtering
        categoryList.addEventListener('click', (e) => {
            if (e.target.matches('.category-btn')) {
                currentFilter = e.target.dataset.category;
                document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                renderVnList();
                // Close drawer after selection
                closeDrawer();
            }
        });

        // Click outside to close drawer
        document.addEventListener('click', (e) => {
            if (categoryDrawer.classList.contains('open')) {
                // Check if the click is outside the drawer and not on the toggle button itself
                if (!categoryDrawer.contains(e.target) && !drawerToggle.contains(e.target)) {
                    closeDrawer();
                }
            }
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

        if (moreMenuToggle) {
            moreMenuToggle.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent document click listener from firing immediately
                moreMenu.classList.toggle('open');
            });
        }
        
        // Close more menu when a link inside is clicked
        if (moreMenu) {
            moreMenu.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') {
                    closeMoreMenu();
                }
            });
        }

        // Click outside to close drawer and more menu
        document.addEventListener('click', (e) => {
            // Drawer closing logic
            if (categoryDrawer.classList.contains('open')) {
                if (!categoryDrawer.contains(e.target) && !drawerToggle.contains(e.target)) {
                    closeDrawer();
                }
            }

            // More menu closing logic
            if (moreMenu && moreMenu.classList.contains('open')) {
                if (!moreMenu.contains(e.target) && !moreMenuToggle.contains(e.target)) {
                    closeMoreMenu();
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
    initializeTheme();
    fetchData();
});
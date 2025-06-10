document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 元素获取 ---
    const vnGrid = document.getElementById('vn-grid');
    const searchInput = document.getElementById('search-input');
    const categoryList = document.getElementById('category-list');
    const drawer = document.getElementById('category-drawer');
    const drawerToggleBtn = document.getElementById('drawer-toggle');
    const drawerCloseBtn = document.getElementById('drawer-close');
    
    // 弹窗元素
    const ratingModal = document.getElementById('rating-modal');
    const reviewModal = document.getElementById('review-modal');
    const modalContainer = document.getElementById('modal-container');
    
    let allVns = [];
    let currentCategory = '全部';

    // --- 初始化 ---
    async function initializeApp() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allVns = await response.json();
            renderVns(allVns);
            populateCategories();
        } catch (error) {
            console.error("无法加载视觉小说数据:", error);
            vnGrid.innerHTML = '<p>数据加载失败，请检查 data.json 文件或网络连接。</p>';
        }
    }

    // --- 渲染函数 ---
    function renderVns(vnsToRender) {
        vnGrid.innerHTML = '';
        if (vnsToRender.length === 0) {
            vnGrid.innerHTML = '<p>没有找到符合条件的作品。</p>';
            return;
        }

        vnsToRender.forEach(vn => {
            const card = document.createElement('div');
            card.className = 'vn-card';
            card.dataset.id = vn.id; // 存储ID以便后续查找

            const ratingStars = '★'.repeat(Math.round(vn.rating)) + '☆'.repeat(10 - Math.round(vn.rating));

            card.innerHTML = `
                <div class="vn-cover">
                    <img src="${vn.cover}" alt="${vn.title}封面" loading="lazy">
                </div>
                <div class="vn-info">
                    <h3 class="vn-title">${vn.title}</h3>
                    <p class="vn-company">${vn.company}</p>
                    <div class="vn-tags">
                        ${vn.tags.map(tag => `<span class="vn-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="vn-rating" data-action="show-rating">
                        <span class="vn-rating-stars">${ratingStars}</span>
                        <span class="vn-rating-text">${vn.rating.toFixed(1)}</span>
                    </div>
                    <div class="vn-review" data-action="show-review">
                        <p>${vn.shortReview}</p>
                    </div>
                </div>
            `;
            vnGrid.appendChild(card);
        });
    }

    function populateCategories() {
        const allTags = new Set(allVns.flatMap(vn => vn.tags));
        categoryList.innerHTML = '<div class="category-item active" data-category="全部">全部</div>';
        allTags.forEach(tag => {
            const categoryItem = document.createElement('div');
            categoryItem.className = 'category-item';
            categoryItem.textContent = tag;
            categoryItem.dataset.category = tag;
            categoryList.appendChild(categoryItem);
        });
    }

    // --- 过滤逻辑 ---
    function filterAndRender() {
        let filteredVns = allVns;

        // 分类过滤
        if (currentCategory !== '全部') {
            filteredVns = filteredVns.filter(vn => vn.tags.includes(currentCategory));
        }

        // 搜索过滤
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filteredVns = filteredVns.filter(vn => vn.title.toLowerCase().includes(searchTerm));
        }
        
        renderVns(filteredVns);
    }
    
    // --- 事件监听 ---
    searchInput.addEventListener('input', filterAndRender);

    categoryList.addEventListener('click', (e) => {
        if (e.target.classList.contains('category-item')) {
            document.querySelector('.category-item.active').classList.remove('active');
            e.target.classList.add('active');
            currentCategory = e.target.dataset.category;
            filterAndRender();
            closeDrawer(); // 选择后自动关闭抽屉
        }
    });

    // 使用事件委托处理卡片点击
    vnGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.vn-card');
        if (!card) return;

        const actionTarget = e.target.closest('[data-action]');
        if (!actionTarget) return;

        const vnId = parseInt(card.dataset.id);
        const action = actionTarget.dataset.action;

        if (action === 'show-rating') {
            showRatingModal(vnId);
        } else if (action === 'show-review') {
            showReviewModal(vnId);
        }
    });

    // --- 抽屉控制 ---
    function openDrawer() { drawer.classList.add('open'); }
    function closeDrawer() { drawer.classList.remove('open'); }
    drawerToggleBtn.addEventListener('click', openDrawer);
    drawerCloseBtn.addEventListener('click', closeDrawer);

    // --- 弹窗控制 ---
    function showRatingModal(vnId) {
        const vn = allVns.find(v => v.id === vnId);
        document.getElementById('rating-modal-title').textContent = `${vn.title} - 详细评分`;
        const body = document.getElementById('rating-modal-body');
        body.innerHTML = Object.entries(vn.detailedRating)
            .map(([key, value]) => `
                <div class="rating-item">
                    <span>${key}</span>
                    <strong>${value.toFixed(1)}</strong>
                </div>
            `).join('');
        ratingModal.classList.add('visible');
    }

    function showReviewModal(vnId) {
        const vn = allVns.find(v => v.id === vnId);
        document.getElementById('review-modal-title').textContent = `${vn.title} - 详细评价`;
        document.getElementById('review-modal-body').textContent = vn.fullReview;
        reviewModal.classList.add('visible');
    }

    function closeModal() {
        ratingModal.classList.remove('visible');
        reviewModal.classList.remove('visible');
    }

    // 点击弹窗背景或关闭按钮关闭弹窗
    modalContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal') || e.target.classList.contains('modal-close-btn')) {
            closeModal();
        }
    });
    
    // --- 启动应用 ---
    initializeApp();
});
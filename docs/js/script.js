document.addEventListener('DOMContentLoaded', () => {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const tocLinks = document.querySelectorAll('.toc-link');
    const sections = document.querySelectorAll('section[id]');

    // Intersection Observer for Table of Contents
    const observerOptions = {
        rootMargin: '-64px 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // Update TOC
                tocLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });

                // Update Sidebar highlight (only for main sections)
                sidebarLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        sidebarLinks.forEach(l => l.classList.remove('active'));
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // Smooth scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- LIVE PREVIEW LOGIC ---
    const API_BASE = 'https://api-league-of-legends-ruby.vercel.app';
    const previewGrid = document.getElementById('preview-grid');
    const loader = document.getElementById('loader');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.getElementById('close-modal');

    let currentTab = 'champions';

    const fetchData = async (endpoint) => {
        loader.classList.add('active');
        previewGrid.innerHTML = '';
        try {
            const response = await fetch(`${API_BASE}${endpoint}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            previewGrid.innerHTML = '<p style="color: #ff4444; grid-column: 1/-1; text-align: center;">Error al conectar con la API</p>';
        } finally {
            loader.classList.remove('active');
        }
    };

    const renderChampions = (champions) => {
        previewGrid.innerHTML = champions.map(champ => `
            <div class="preview-item" onclick="showDetail('/lol/champion/${champ.id}', 'champion')">
                <img src="${champ.image}" alt="${champ.name}">
                <p>${champ.name}</p>
            </div>
        `).join('');
    };

    const renderItems = (items) => {
        previewGrid.innerHTML = items.map(item => `
            <div class="preview-item" onclick="showDetail('/lol/item/${item.id}', 'item')">
                <img src="${item.image}" alt="${item.name}">
                <p>${item.name}</p>
            </div>
        `).join('');
    };

    const renderSpells = (spells) => {
        previewGrid.innerHTML = spells.map(spell => `
            <div class="preview-item" onclick="showDetail('/lol/spell/${spell.id}', 'spell')">
                <img src="${spell.image}" alt="${spell.name}">
                <p>${spell.name}</p>
            </div>
        `).join('');
    };

    window.showDetail = async (endpoint, type) => {
        modalOverlay.classList.add('active');
        modalBody.innerHTML = '<div class="spinner"></div>';
        
        try {
            const data = await (await fetch(`${API_BASE}${endpoint}`)).json();
            
            if (type === 'champion') {
                const splashUrl = data.skins && data.skins.length > 0 ? data.skins[0].splash : data.image;
                modalBody.innerHTML = `
                    <div class="detail-header">
                        <img src="${splashUrl}" class="detail-header-img">
                        <div class="detail-header-info">
                            <h1>${data.name}</h1>
                            <p>${data.title}</p>
                        </div>
                    </div>
                    <div class="detail-content">
                        <h3>Lore</h3>
                        <p>${data.lore || 'No lore available.'}</p>
                        <h3>Estadísticas</h3>
                        <div class="stat-tags">
                            ${(data.tags || []).map(tag => `<span class="stat-tag">${tag}</span>`).join('')}
                        </div>
                        <h3 style="margin-top: 32px">Skins Disponibles</h3>
                        <div class="skin-grid">
                            ${(data.skins || []).map(skin => `
                                <div class="skin-item" onclick="document.querySelector('.detail-header-img').src='${skin.splash}'">
                                    <img src="${skin.splash}" loading="lazy" alt="${skin.name}">
                                    <p>${skin.name === 'default' ? data.name : skin.name}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            } else if (type === 'item') {
                modalBody.innerHTML = `
                    <div class="detail-content">
                        <div style="display: flex; gap: 24px; align-items: start; margin-bottom: 24px">
                            <img src="${data.image}" style="width: 120px; border-radius: 12px; border: 2px solid var(--accent-color)">
                            <div>
                                <h1>${data.name}</h1>
                                <p style="color: var(--accent-color); font-weight: 700; margin: 0">Oro: ${data.gold.total} (Venta: ${data.gold.sell})</p>
                            </div>
                        </div>
                        <h3>Descripción</h3>
                        <div style="color: #cbd5e0">${data.description}</div>
                        <h3 style="margin-top: 24px">Estadísticas</h3>
                        <div class="stat-tags">
                            ${Object.keys(data.stats).map(stat => `<span class="stat-tag">${stat}: ${data.stats[stat]}</span>`).join('')}
                        </div>
                    </div>
                `;
            } else if (type === 'spell') {
                modalBody.innerHTML = `
                    <div class="detail-content">
                        <div style="display: flex; gap: 24px; align-items: start; margin-bottom: 24px">
                            <img src="${data.image}" style="width: 120px; border-radius: 12px; border: 2px solid var(--accent-color)">
                            <div>
                                <h1>${data.name}</h1>
                                <p style="color: var(--accent-color); font-weight: 700; margin: 0">Cooldown: ${data.cooldownBurn}s</p>
                            </div>
                        </div>
                        <h3>Descripción</h3>
                        <p>${data.description}</p>
                        <h3>Nivel Requerido: ${data.summonerLevel}</h3>
                    </div>
                `;
            }
        } catch (error) {
            modalBody.innerHTML = '<p>Error al cargar detalles</p>';
        }
    };

    const loadTab = async (tab) => {
        currentTab = tab;
        tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
        
        if (tab === 'champions') {
            const data = await fetchData('/lol/champions');
            if (data) renderChampions(data.champions);
        } else if (tab === 'items') {
            const data = await fetchData('/lol/items');
            if (data) renderItems(data.items);
        } else if (tab === 'spells') {
            const data = await fetchData('/lol/spells');
            if (data) renderSpells(data.spells);
        }
    };

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => loadTab(btn.dataset.tab));
    });

    closeModal.addEventListener('click', () => modalOverlay.classList.remove('active'));
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });

    // Initial load
    loadTab('champions');
});

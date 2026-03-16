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
            previewGrid.innerHTML = '<p style="color: #ff4444; grid-column: 1/-1; text-align: center;">Error connecting to the API</p>';
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

    const renderRunes = (runes) => {
        previewGrid.innerHTML = runes.map(path => `
            <div class="preview-item rune-path" onclick="showDetail('/lol/runes', 'runes')">
                <img src="${path.icon}" alt="${path.name}" style="background: rgba(0,0,0,0.4); padding: 8px">
                <p>${path.name}</p>
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
                        <h3>Stats</h3>
                        <div class="stat-tags">
                            ${(data.tags || []).map(tag => `<span class="stat-tag">${tag}</span>`).join('')}
                        </div>

                        <h3 style="margin-top: 32px">Abilities</h3>
                        <div class="abilities-list">
                            <div class="ability-item">
                                <img src="${data.passive.image}" class="ability-icon active" onclick="updateAbilityDesc(this, '${data.passive.name}', '${data.passive.description.replace(/'/g, "\\'")}')">
                                <span>P</span>
                            </div>
                            ${data.spells.map((spell, index) => `
                                <div class="ability-item">
                                    <img src="${spell.image}" class="ability-icon" onclick="updateAbilityDesc(this, '${spell.name}', '${spell.description.replace(/'/g, "\\'")}')">
                                    <span>${['Q', 'W', 'E', 'R'][index]}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div id="ability-details" class="ability-details-box">
                            <h4 id="ability-name">${data.passive.name}</h4>
                            <p id="ability-desc">${data.passive.description}</p>
                        </div>

                        <h3 style="margin-top: 32px">Base Stats</h3>
                        <div class="stats-grid-detailed">
                            <div class="stat-item">
                                <span class="stat-label">Health (HP)</span>
                                <span class="stat-value">${data.stats.hp} (+${data.stats.hpperlevel}/lv)</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">${data.partype || 'Resource'}</span>
                                <span class="stat-value">${data.stats.mp} (+${data.stats.mpperlevel}/lv)</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Armor</span>
                                <span class="stat-value">${data.stats.armor} (+${data.stats.armorperlevel}/lv)</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Magic Resist</span>
                                <span class="stat-value">${data.stats.spellblock} (+${data.stats.spellblockperlevel}/lv)</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Attack Damage</span>
                                <span class="stat-value">${data.stats.attackdamage} (+${data.stats.attackdamageperlevel}/lv)</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Movement Speed</span>
                                <span class="stat-value">${data.stats.movespeed}</span>
                            </div>
                        </div>

                        <h3 style="margin-top: 32px">Available Skins</h3>
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
                                <p style="color: var(--accent-color); font-weight: 700; margin: 0">Gold: ${data.gold.total} (Sell: ${data.gold.sell})</p>
                            </div>
                        </div>
                        <h3>Description</h3>
                        <div style="color: #cbd5e0">${data.description}</div>
                        <h3 style="margin-top: 24px">Stats</h3>
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
                        <h3>Description</h3>
                        <p>${data.description}</p>
                        <h3>Required Level: ${data.summonerLevel}</h3>
                    </div>
                `;
            } else if (type === 'runes') {
                // For simplicity, showing the path details when a path is clicked
                const path = data.runes[0]; // Example: Precision
                modalBody.innerHTML = `
                    <div class="detail-header" style="height: 150px">
                        <div class="detail-header-info" style="background: linear-gradient(transparent, var(--bg-color))">
                            <h1>Runes: Reforged</h1>
                        </div>
                    </div>
                    <div class="detail-content">
                        ${data.runes.map(path => `
                            <div class="rune-path-section" style="margin-bottom: 40px">
                                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px">
                                    <img src="${path.icon}" style="width: 48px">
                                    <h2 style="color: var(--accent-color)">${path.name}</h2>
                                </div>
                                <div class="rune-slots-grid" style="display: grid; gap: 16px">
                                    ${path.slots.map((slot, idx) => `
                                        <div class="rune-slot" style="display: flex; gap: 12px; background: var(--sidebar-bg); padding: 12px; border-radius: 8px">
                                            ${slot.runes.map(rune => `
                                                <div class="rune-mini" title="${rune.longDesc.replace(/<[^>]*>?/gm, '')}" style="text-align: center; width: 80px">
                                                    <img src="${rune.icon}" style="width: 40px; margin-bottom: 4px">
                                                    <p style="font-size: 0.7rem; margin: 0">${rune.name}</p>
                                                </div>
                                            `).join('')}
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
        } catch (error) {
            modalBody.innerHTML = '<p>Error loading details</p>';
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
        } else if (tab === 'runes') {
            const data = await fetchData('/lol/runes');
            if (data) renderRunes(data.runes);
        }
    };

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => loadTab(btn.dataset.tab));
    });

    closeModal.addEventListener('click', () => modalOverlay.classList.remove('active'));
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });

    // Ability Description Switcher
    window.updateAbilityDesc = (el, name, desc) => {
        document.querySelectorAll('.ability-icon').forEach(img => img.classList.remove('active'));
        el.classList.add('active');
        document.getElementById('ability-name').innerText = name;
        document.getElementById('ability-desc').innerHTML = desc;
    };

    // Initial load
    loadTab('champions');
});

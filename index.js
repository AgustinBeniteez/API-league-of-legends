import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Cache para los datos
let lolCache = null;
let tftCache = null;
let itemsCache = null;
let spellsCache = null;
let runesCache = null;
let lastLolUpdate = null;
let lastTftUpdate = null;
let lastItemsUpdate = null;
let lastSpellsUpdate = null;
let lastRunesUpdate = null;

const getLatestVersion = async () => {
    const response = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
    return response.data[0];
};

const fetchLolChampions = async () => {
    try {
        const version = await getLatestVersion();
        const response = await axios.get(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`);
        const championsData = response.data.data;
        const championsArray = Object.values(championsData).map(champion => ({
            id: champion.id,
            key: champion.key,
            name: champion.name,
            title: champion.title,
            blurb: champion.blurb,
            info: champion.info,
            image: `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion.image.full}`,
            tags: champion.tags,
            partype: champion.partype,
            stats: {
                hp: champion.stats.hp,
                hpperlevel: champion.stats.hpperlevel,
                mp: champion.stats.mp,
                mpperlevel: champion.stats.mpperlevel,
                movespeed: champion.stats.movespeed,
                armor: champion.stats.armor,
                armorperlevel: champion.stats.armorperlevel,
                spellblock: champion.stats.spellblock,
                spellblockperlevel: champion.stats.spellblockperlevel,
                attackrange: champion.stats.attackrange,
                hpregen: champion.stats.hpregen,
                hpregenperlevel: champion.stats.hpregenperlevel,
                mpregen: champion.stats.mpregen,
                mpregenperlevel: champion.stats.mpregenperlevel,
                crit: champion.stats.crit,
                critperlevel: champion.stats.critperlevel,
                attackdamage: champion.stats.attackdamage,
                attackdamageperlevel: champion.stats.attackdamageperlevel,
                attackspeedperlevel: champion.stats.attackspeedperlevel,
                attackspeed: champion.stats.attackspeed
            }
        }));

        lolCache = {
            version,
            count: championsArray.length,
            champions: championsArray
        };
        lastLolUpdate = new Date();
        
        return lolCache;
    } catch (error) {
        console.error('Error fetching LoL champions:', error.message);
        throw error;
    }
};

const fetchItems = async () => {
    try {
        const version = await getLatestVersion();
        const response = await axios.get(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/item.json`);
        
        const itemsData = response.data.data;
        const itemsArray = Object.values(itemsData).map(item => ({
            id: item.id || Object.keys(itemsData).find(key => itemsData[key] === item),
            name: item.name,
            description: item.description,
            plaintext: item.plaintext,
            into: item.into,
            from: item.from,
            image: `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item.image.full}`,
            gold: item.gold,
            tags: item.tags,
            maps: item.maps,
            stats: item.stats
        }));

        itemsCache = {
            version,
            count: itemsArray.length,
            items: itemsArray
        };
        lastItemsUpdate = new Date();
        
        return itemsCache;
    } catch (error) {
        console.error('Error fetching items:', error.message);
        throw error;
    }
};

const fetchSpells = async () => {
    try {
        const version = await getLatestVersion();
        const response = await axios.get(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/summoner.json`);
        
        const spellsData = response.data.data;
        const spellsArray = Object.values(spellsData).map(spell => ({
            id: spell.id,
            key: spell.key,
            name: spell.name,
            description: spell.description,
            tooltip: spell.tooltip,
            maxrank: spell.maxrank,
            cooldown: spell.cooldown,
            cooldownBurn: spell.cooldownBurn,
            cost: spell.cost,
            costBurn: spell.costBurn,
            datavalues: spell.datavalues,
            effect: spell.effect,
            effectBurn: spell.effectBurn,
            vars: spell.vars,
            summonerLevel: spell.summonerLevel,
            modes: spell.modes,
            costType: spell.costType,
            maxammo: spell.maxammo,
            range: spell.range,
            rangeBurn: spell.rangeBurn,
            image: `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${spell.image.full}`,
            resource: spell.resource
        }));

        spellsCache = {
            version,
            count: spellsArray.length,
            spells: spellsArray
        };
        lastSpellsUpdate = new Date();
        
        return spellsCache;
    } catch (error) {
        console.error('Error fetching spells:', error.message);
        throw error;
    }
};

const fetchRunes = async () => {
    try {
        const version = await getLatestVersion();
        const response = await axios.get(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/runesReforged.json`);
        
        const runesData = response.data;
        const runesArray = runesData.map(path => ({
            id: path.id,
            key: path.key,
            icon: `https://ddragon.leagueoflegends.com/cdn/img/${path.icon}`,
            name: path.name,
            slots: path.slots.map(slot => ({
                runes: slot.runes.map(rune => ({
                    id: rune.id,
                    key: rune.key,
                    icon: `https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`,
                    name: rune.name,
                    shortDesc: rune.shortDesc,
                    longDesc: rune.longDesc
                }))
            }))
        }));

        runesCache = {
            version,
            count: runesArray.length,
            runes: runesArray
        };
        lastRunesUpdate = new Date();
        
        return runesCache;
    } catch (error) {
        console.error('Error fetching runes:', error.message);
        throw error;
    }
};

const fetchTftChampions = async () => {
    try {
        const version = await getLatestVersion();
        const response = await axios.get(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/tft-champion.json`);
        
        const tftData = response.data.data;
        const tftArray = Object.values(tftData).map(champion => ({
            id: champion.id,
            name: champion.name,
            tier: champion.tier,
            cost: champion.cost,
            image: `https://ddragon.leagueoflegends.com/cdn/${version}/img/tft-champion/${champion.image.full}`,
            stats: champion.stats
        }));

        tftCache = {
            version,
            count: tftArray.length,
            champions: tftArray
        };
        lastTftUpdate = new Date();
        
        return tftCache;
    } catch (error) {
        console.error('Error fetching TFT champions:', error.message);
        throw error;
    }
};

// Middleware para asegurar que tenemos datos de LoL
const ensureLolData = async (req, res, next) => {
    const ONE_HOUR = 60 * 60 * 1000;
    if (!lolCache || (new Date() - lastLolUpdate > ONE_HOUR)) {
        try {
            await fetchLolChampions();
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch LoL data' });
        }
    }
    next();
};

const ensureItemsData = async (req, res, next) => {
    const ONE_HOUR = 60 * 60 * 1000;
    if (!itemsCache || (new Date() - lastItemsUpdate > ONE_HOUR)) {
        try {
            await fetchItems();
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch items data' });
        }
    }
    next();
};

const ensureSpellsData = async (req, res, next) => {
    const ONE_HOUR = 60 * 60 * 1000;
    if (!spellsCache || (new Date() - lastSpellsUpdate > ONE_HOUR)) {
        try {
            await fetchSpells();
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch spells data' });
        }
    }
    next();
};

// Middleware para asegurar que tenemos datos de TFT
const ensureRunesData = async (req, res, next) => {
    const ONE_HOUR = 60 * 60 * 1000;
    if (!runesCache || (new Date() - lastRunesUpdate > ONE_HOUR)) {
        try {
            await fetchRunes();
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch runes data' });
        }
    }
    next();
};

const ensureTftData = async (req, res, next) => {
    const ONE_HOUR = 60 * 60 * 1000;
    if (!tftCache || (new Date() - lastTftUpdate > ONE_HOUR)) {
        try {
            await fetchTftChampions();
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch TFT data' });
        }
    }
    next();
};

app.get('/lol/champions', ensureLolData, (req, res) => {
    res.json(lolCache);
});

app.get('/lol/champions/:role', ensureLolData, (req, res) => {
    const { role } = req.params;

    if (role) {
        const filteredChampions = lolCache.champions.filter(champion =>
            champion.tags.some(tag => tag.toLowerCase() === role.toLowerCase())
        );
        return res.json({
            ...lolCache,
            count: filteredChampions.length,
            champions: filteredChampions
        });
    }
});

app.get('/lol/champion/:id', ensureLolData, async (req, res) => {
    const { id } = req.params;
    const championBasic = lolCache.champions.find(c => c.id === id || c.name.toLowerCase() === id.toLowerCase() || c.key === id);

    if (!championBasic) {
        return res.status(404).json({ error: 'LoL champion not found' });
    }

    try {
        const version = lolCache.version;
        // Fetch detailed data for skins
        const response = await axios.get(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion/${championBasic.id}.json`);
        const detailedData = response.data.data[championBasic.id];
        
        const championWithSkins = {
            ...championBasic,
            skins: detailedData.skins.map(skin => ({
                id: skin.id,
                num: skin.num,
                name: skin.name,
                chromas: skin.chromas,
                splash: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championBasic.id}_${skin.num}.jpg`,
                loading: `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championBasic.id}_${skin.num}.jpg`
            })),
            spells: detailedData.spells.map(spell => ({
                id: spell.id,
                name: spell.name,
                description: spell.description,
                image: `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${spell.image.full}`
            })),
            passive: {
                name: detailedData.passive.name,
                description: detailedData.passive.description,
                image: `https://ddragon.leagueoflegends.com/cdn/${version}/img/passive/${detailedData.passive.image.full}`
            },
            lore: detailedData.lore
        };

        res.json(championWithSkins);
    } catch (error) {
        console.error('Error fetching detailed champion data:', error.message);
        res.json(championBasic); // Fallback to basic data if detailed fetch fails
    }
});

app.get('/lol/items', ensureItemsData, (req, res) => {
    res.json(itemsCache);
});

app.get('/lol/items/:tag', ensureItemsData, (req, res) => {
    const { tag } = req.params;

    if (tag) {
        const filteredItems = itemsCache.items.filter(item =>
            item.tags.some(t => t.toLowerCase() === tag.toLowerCase())
        );
        return res.json({
            ...itemsCache,
            count: filteredItems.length,
            items: filteredItems
        });
    }
});

app.get('/lol/item/:id', ensureItemsData, (req, res) => {
    const { id } = req.params;
    const item = itemsCache.items.find(i => i.id == id || i.name.toLowerCase() === id.toLowerCase());

    if (!item) {
        return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
});

app.get('/lol/spells', ensureSpellsData, (req, res) => {
    res.json(spellsCache);
});

app.get('/lol/spell/:id', ensureSpellsData, (req, res) => {
    const { id } = req.params;
    const spell = spellsCache.spells.find(s => s.id === id || s.key == id || s.name.toLowerCase() === id.toLowerCase());

    if (!spell) {
        return res.status(404).json({ error: 'Spell not found' });
    }

    res.json(spell);
});

app.get('/lol/runes', ensureRunesData, (req, res) => {
    res.json(runesCache);
});

app.get('/tft/champions', ensureTftData, (req, res) => {
    res.json(tftCache);
});

app.get('/tft/champion/:id', ensureTftData, (req, res) => {
    const { id } = req.params;
    const champion = tftCache.champions.find(c => c.id === id || c.name.toLowerCase() === id.toLowerCase());

    if (!champion) {
        return res.status(404).json({ error: 'TFT champion not found' });
    }

    res.json(champion);
});

app.get('/', (req, res) => {
    res.json({
        message: 'League of Legends & TFT API',
        endpoints: {
            lol: {
                champions : {
                    all_champions: '/lol/champions',
                    champions_by_role: '/lol/champions/:role',
                    single_champion: '/lol/champion/:id',
                },
                items : {
                    all_items: '/lol/items',
                    items_by_tag: '/lol/items/:tag',
                    single_item: '/lol/item/:id'
                },
                spells: {
                    all_spells: '/lol/spells',
                    single_spell: '/lol/spell/:id'
                },
                runes: {
                    all_runes: '/lol/runes'
                }
            },
            tft: {
                all_champions: '/tft/champions',
                single_champion: '/tft/champion/:id'
            }
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

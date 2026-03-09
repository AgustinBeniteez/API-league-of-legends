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
let lastLolUpdate = null;
let lastTftUpdate = null;

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
            stats: champion.stats
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

// Middleware para asegurar que tenemos datos de TFT
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

app.get('/lol/champions/:id', ensureLolData, (req, res) => {
    const { id } = req.params;
    const champion = lolCache.champions.find(
        c => c.id.toLowerCase() === id.toLowerCase() || c.key === id
    );

    if (!champion) {
        return res.status(404).json({ error: 'LoL champion not found' });
    }

    res.json(champion);
});

app.get('/tft/champions', ensureTftData, (req, res) => {
    res.json(tftCache);
});

app.get('/tft/champions/:id', ensureTftData, (req, res) => {
    const { id } = req.params;
    const champion = tftCache.champions.find(
        c => c.id.toLowerCase() === id.toLowerCase()
    );

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
                all_champions: '/lol/champions',
                single_champion: '/lol/champions/:id'
            },
            tft: {
                all_champions: '/tft/champions',
                single_champion: '/tft/champions/:id'
            }
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

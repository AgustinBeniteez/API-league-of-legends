# 🎮 League of Legends & TFT API

This is a robust and easy-to-use API built with **Node.js** and **Express** that provides up-to-date information about League of Legends (LoL) and Teamfight Tactics (TFT) champions. It consumes data directly from Riot Games' official **Data Dragon** service, offering an abstraction layer that makes it easy to consume in modern applications.

## ✍️ Author and Contributor
- **Author**: Agustin Benitez
- **Data provided by**: [Riot Games](https://www.riotgames.com/) via their official **Data Dragon** API.

## 🚀 Features

- **Real-Time Data**: Automatic synchronization with the latest Riot Games patch version.
- **Friendly Format**: Data transformed from complex objects to easy-to-iterate Arrays.
- **Image URLs**: Direct and complete links to champion images.
- **Caching System**: Automatic refresh every 1 hour to optimize performance and avoid rate limits.
- **Multi-Game Support**: Dedicated endpoints for both LoL and TFT.

## 🛠️ Technologies

- **Node.js**: Runtime environment.
- **Express**: Framework for the web server.
- **Axios**: HTTP client to consume Data Dragon.
- **CORS**: Enabled to allow requests from any origin.

## 📌 Endpoints

### ⚔️ League of Legends
- `GET /lol/champions`: Gets the full list of champions with their stats, lore, and images.
- `GET /lol/champion/:id`: Gets the detail of a specific champion (you can use the ID like 'Aatrox' or its numeric Key) usage example: `/lol/champion/Aatrox` or `/lol/champion/266`.
- `GET /lol/items`: Gets the full list of all items.
- `GET /lol/item/:id`: Gets the detail of a specific item by its ID or name.
- `GET /lol/spells`: Gets the full list of summoner spells.
- `GET /lol/runes`: Gets the full list of runes Reforged.

### ♟️ Teamfight Tactics
- `GET /tft/champions`: Gets the full list of TFT champions including cost, tier, and basic stats.
- `GET /tft/champion/:id`: Gets the detail of a TFT champion by its unique ID usage example: `/tft/champion/TFT13_Lux`.

## 💻 Installation and Usage

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AgustinBeniteez/API-league-of-legends.git
   cd API-league-of-legends
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the server**:
   ```bash
   npm run dev
   ```
   The server will start at `http://localhost:3000`.

---
## 📄 License
This project is under the **MIT** License. See the [LICENSE](LICENSE) file for more details.

---
© 2026 Developed by Agustin Benitez.

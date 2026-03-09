# 🎮 API de League of Legends & TFT

Esta es una API robusta y fácil de usar construida con **Node.js** y **Express** que proporciona información actualizada sobre los campeones de League of Legends (LoL) y Teamfight Tactics (TFT). Consume datos directamente del servicio oficial **Data Dragon** de Riot Games, ofreciendo una capa de abstracción que facilita su consumo en aplicaciones modernas.

## ✍️ Autor y Contribuidor
- **Autor**: Agustin Benitez
- **Datos proporcionados por**: [Riot Games](https://www.riotgames.com/) a través de su API oficial **Data Dragon**.

## 🚀 Características

- **Datos en Tiempo Real**: Sincronización automática con la última versión de parches de Riot Games.
- **Formato Amigable**: Datos transformados de objetos complejos a Arrays fáciles de iterar.
- **URLs de Imágenes**: Enlaces directos y completos a las imágenes de los campeones.
- **Sistema de Cache**: Refresco automático cada 1 hora para optimizar el rendimiento y evitar límites de tasa.
- **Soporte Multi-Juego**: Endpoints dedicados tanto para LoL como para TFT.

## 🛠️ Tecnologías

- **Node.js**: Entorno de ejecución.
- **Express**: Framework para el servidor web.
- **Axios**: Cliente HTTP para consumir Data Dragon.
- **CORS**: Habilitado para permitir peticiones desde cualquier origen.

## 📌 Endpoints

### ⚔️ League of Legends
- `GET /lol/champions`: Obtiene la lista completa de campeones con sus estadísticas, historia e imágenes.
- `GET /lol/champion/:id`: Obtiene el detalle de un campeón específico (puedes usar el ID como 'Aatrox' o su Key numérica) ejemplo uso: `/lol/champion/Aatrox` o `/lol/champion/266`.
- `GET /lol/items`: Obtiene la lista completa de todos los ítems.
- `GET /lol/item/:id`: Obtiene el detalle de un ítem específico por su ID o nombre.

### ♟️ Teamfight Tactics
- `GET /tft/champions`: Obtiene la lista completa de campeones de TFT incluyendo coste, tier y stats básicos.
- `GET /tft/champion/:id`: Obtiene el detalle de un campeón de TFT por su ID único ejemplo uso: `/tft/champion/1`.

## 💻 Instalación y Uso

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/AgustinBeniteez/API-league-of-legends.git
   cd API-league-of-legends
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Ejecutar el servidor**:
   ```bash
   node index.js
   ```
   El servidor se iniciará en `http://localhost:3000`.

---
## 📄 Licencia
Este proyecto está bajo la Licencia **MIT**. Consulta el archivo [LICENSE](file:///c:/Users/Agustin/Documents/GitHub/API-league-of-legends/LICENSE) para más detalles.

---
© 2026 Desarrollado por Agustin Benitez.

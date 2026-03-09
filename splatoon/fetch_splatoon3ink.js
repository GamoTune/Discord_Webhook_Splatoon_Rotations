const axios = require('axios');
const fs = require('fs');
const CC = require('../console_color').CC;

const LOCAL_URL = "splatoon/";

const USER_AGENT = "GamoTune's Discord Bot (my discord tag : 'gamotune' or my dev discord server : 'https://discord.gg/m9scwRtAzX')";

async function fetchSchedules() {
    let url = 'https://splatoon3.ink/data/schedules.json';
    console.log(CC.FgYellow, "Récupération des données des rotations...");
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': USER_AGENT
            }
        });
        // Afficher les données récupérées
        console.log(CC.FgGreen, "Données des rotations récupérées");
        fs.writeFileSync(LOCAL_URL + 'rotations_data.json', JSON.stringify(response.data));
        console.log(CC.FgGreen, "Données sauvegardées");
    } catch (error) {
        console.error(CC.FgRed, 'Erreur lors de la récupération des données:', error);
    }
}

async function fetchVF() {
    let url = 'https://splatoon3.ink/data/locale/fr-FR.json';
    console.log(CC.FgYellow, "Récupération des données des infos en Français...");
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': USER_AGENT
            }
        });
        // Afficher les données récupérées
        console.log(CC.FgGreen, "Données des infos en Français récupérées");
        fs.writeFileSync(LOCAL_URL + 'splatoon_data.json', JSON.stringify(response.data));
        console.log(CC.FgGreen, "Données sauvegardées");
    } catch (error) {
        console.error(CC.FgRed, 'Erreur lors de la récupération des données:', error);
    }
}

module.exports = {
    fetchSchedules,
    fetchVF
}
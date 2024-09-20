const { WebhookClient } = require('discord.js');
const { json_to_js, js_to_json } = require('../convert_json.js');
const Canvas = require('canvas');
const fs = require('fs');
const axios = require('axios');
const { get_rotations } = require('./get.js');



// Constantes ------------------------------------------------------------------------------------------------------------


const LOCAL_URL = "splatoon/";
const USER_AGENT = "GamoTune's Discord Bot (my discord tag : 'gamotune' or my dev discord server : 'https://discord.gg/m9scwRtAzX')";


const CC = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",

    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",
    FgGray: "\x1b[90m",

    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m",
    BgGray: "\x1b[100m",
}

const COLORS = {
    regular: '#19d719',
    bankara: '#f54910',
    x: '#0fdb9b',
    fest: '#717178',
    event: '#f02d7e',
    coopGrouping: '#FF5600',
}

const ORDER = {
    regular: 0,
    bankara: 1,
    bankaraSérie: 1,
    bankaraOuvert: 2,
    x: 3,
    event: 4,
    coopGrouping: 5,
    festOuvert: 6,
    festSérie: 7,
    tricolor: 8,
}

const TYPE_FR_NAME = {
    regular: "Match Classique",
    bankara: "Match Anarchie",
    x: "Match X",
    event: "Match Challenge",
    fest: "Festimatch",
    coopGrouping: "Salmon Run"
}

const TYPE_ENVOIE = {
    regular: "normal",
    bankara: "normal",
    bankaraSérie: "normal",
    bankaraOuvert: "normal",
    x: "normal",
    festSérie: "normal",
    festOuvert: "normal",
    tricolor: "normal",
    event: "event",
    coopGrouping: "coop",
}

const LINKS_UNDEFINED = {
    regular: LOCAL_URL + "img_rotations/undefined/normal_undefined.png",
    bankara: LOCAL_URL + "img_rotations/undefined/normal_undefined.png",
    x: LOCAL_URL + "img_rotations/undefined/normal_undefined.png",
    fest: LOCAL_URL + "img_rotations/undefined/normal_undefined.png",
    tricolor: LOCAL_URL + "img_rotations/undefined/normal_undefined.png",
    event: LOCAL_URL + "img_rotations/undefined/challenge_undefined.png",
    coopGrouping: LOCAL_URL + "img_rotations/undefined/salmon_undefined.png",
}

// ------------------------------------------------------------------------------------------------------------

async function get_webhooks_url() {
    let urls = await json_to_js(LOCAL_URL + 'webhooks.json');
    return urls;
}

async function get_test_webhooks_url() {
    let urls = await json_to_js(LOCAL_URL + 'webhooks_test.json');
    return urls;
}

async function send_to_servers(file) {
    let urls = await get_test_webhooks_url();
    let urls_list = urls[file.type];
    await Promise.all(urls_list.map(url => send_message(file.img, url)));
}

async function send_message(file, url) {
    try {
        const webhookClient = new WebhookClient({ url: url });

        await webhookClient.send({
            username: 'Splatoon 3 Rotations',
            avatarURL: 'https://cdn.wikimg.net/en/splatoonwiki/images/3/3d/S3_Icon_Judd.png',
            files: [file]
        })
            .then(() => {
                console.log(CC.FgGreen, 'Message sent at : ' + new Date());
            });
    }
    catch (error) {
        console.error(CC.FgRed, 'Error while sending message : ', error);
    }
}

function add_two_hours(isoString) {
    // Convertir la date ISO en objet Date
    const date = new Date(isoString);

    // Ajouter 2 heures
    date.setHours(date.getHours() + 2);
    return date;
}

function set_hours_pair(isoString) {
    // Convertir la date ISO en objet Date
    const date = new Date(isoString);

    // Mettre les heures à pair
    if (date.getHours() % 2 == 1) {
        date.setHours(date.getHours() + 1);
    }

    date.setMinutes(0, 0, 0);

    return date;
}

function isDateBetween(dateToCheck, startDate, endDate) {
    const date = dateToCheck;
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Vérifie si la date se trouve entre les deux autres
    return date >= start && date <= end;
}


// Fonction pour récupérer les données -----------------------------------------------------------------------------------------------


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

// Fonction pour créer les images -----------------------------------------------------------------------------------------------


async function create_classic_image(type, settings, startTime, endTime) {

    try {
        console.log(CC.FgYellow, "Création de l'image : " + type);

        const url_map1 = await get_stage_url_by_id(settings.vsStages[0].vsStageId);
        const url_map2 = await get_stage_url_by_id(settings.vsStages[1].vsStageId);

        const rule = settings.vsRule.id;
        var bg_type = { n: 2, width: 600, link: LOCAL_URL + "img/bg.png" };

        var anarchie_type = "";
        if (type == "bankara") {
            if (settings.bankaraMode == "CHALLENGE") {
                anarchie_type = "Série"
            } else {
                anarchie_type = "Ouvert"
            }
        } else if (type == "fest") {
            bg_type = { n: 3, width: 400, link: LOCAL_URL + "img/bg_fest.png" };
            if (settings.festMode == "CHALLENGE") {
                anarchie_type = "Série"
            } else {
                anarchie_type = "Ouvert"
            }
        }

        const text_type = TYPE_FR_NAME[type];
        var text_rule = get_vf_of(settings.vsRule.id, "rules");
        text_rule = anarchie_type != "" ? text_rule + " (" + anarchie_type + ")" : text_rule;

        const text_start = get_hours_normal(startTime);
        const text_end = get_hours_normal(endTime);

        const text_map1 = get_vf_of(settings.vsStages[0].id, "stages");
        const text_map2 = get_vf_of(settings.vsStages[1].id, "stages");

        const X_MAX = 860;
        const Y_MAX = 400;

        const canvas = Canvas.createCanvas(X_MAX, Y_MAX);
        const context = canvas.getContext('2d');

        //Chargement des images
        const img_map1 = await Canvas.loadImage(url_map1);
        const img_map2 = await Canvas.loadImage(url_map2);
        const img_match_type = await Canvas.loadImage(LOCAL_URL + "img/" + type + ".png");
        const img_rule = await Canvas.loadImage(LOCAL_URL + "img/" + rule + ".png");
        const img_bg = await Canvas.loadImage(bg_type.link);
        const img_big_rect = await Canvas.loadImage(LOCAL_URL + "img/big_rec.png");
        const img_piti_rect = await Canvas.loadImage(LOCAL_URL + "img/petit_rec.png");

        context.font = '30px splatoon2';
        context.textAlign = 'left';
        context.textBaseline = 'middle';

        //La couleur de fond
        context.fillStyle = COLORS[type];
        context.fillRect(0, 0, X_MAX, Y_MAX);

        //Le filtre de fond
        for (let i = 0; i < bg_type.n; i++) {
            context.drawImage(img_bg, i * bg_type.width, 0, bg_type.width, Y_MAX);
        }

        //Icone du type de match
        context.drawImage(img_match_type, 0, 0, 76, 76);

        //Texte du type de match
        context.fillStyle = 'white';
        context.fillText(text_type, 80, 76 / 2);

        // Ajout des rectangles
        context.drawImage(img_piti_rect, 640, 14);
        context.drawImage(img_big_rect, 10, 76);


        // Ajout de l'icone de la règle
        context.drawImage(img_rule, 20, 92);

        // Ajout du texte de la règle
        context.fillText(text_rule, 70, 92 + 35 / 2);

        // Ajout des images des maps
        context.drawImage(img_map1, 20, 143, 400, 200);
        context.drawImage(img_map2, 440, 143, 400, 200);

        // Ajout du texte des maps (centré horizontalement et verticalement)
        context.fillText(text_map1, 20, 353 + 26 / 2); // Ajustez les coordonnées pour centrer horizontalement et verticalement
        context.fillText(text_map2, 440, 353 + 26 / 2); // Ajustez les coordonnées pour centrer horizontalement et verticalement

        // Ajout de l'heure
        context.textAlign = 'center';
        context.fillText(text_start + ' - ' + text_end, 640 + 210 / 2, 27 + 26 / 2);

        console.log(CC.FgGreen, "Image créée : " + type + anarchie_type);

        //Enregistrement de l'image

        const img = canvas.toBuffer('image/png');
        const link = `${LOCAL_URL}img_rotations/${type}${anarchie_type}.png`;
        await save_image(img, link);

        //Renvoie de l'image avec infos

        return {
            img: img,
            type: type + anarchie_type,
            link: link,
        };
    } catch (error) {
        console.error(CC.FgRed, 'Erreur lors de la création de l\'image');
        console.log(CC.FgRed, 'Envoie de l\'image undefined');

        //Envoie de l'image undefined
        return {
            img: LINKS_UNDEFINED[type],
            type: type,
            link: LINKS_UNDEFINED[type],
        };

    }
}

async function create_tricolor_image(type, settings, stage, startTime, endTime) {

    try {
        console.log(CC.FgYellow, "Création de l'image : Tricolor");

        const url_map1 = stage.image.url;

        const rule = settings.vsRule.id;
        var bg_type = { n: 3, width: 400, link: LOCAL_URL + "img/bg_fest.png" };

        const text_type = "Guerre Tricolore"
        const text_rule = "Guerre de Territoire";

        const text_start = get_hours_normal(startTime);
        const text_end = get_hours_normal(endTime);

        const text_map1 = get_vf_of(stage.id, "stages");

        const X_MAX = 860;
        const Y_MAX = 400;

        const canvas = Canvas.createCanvas(X_MAX, Y_MAX);
        const context = canvas.getContext('2d');

        //Chargement des images
        const img_map1 = await Canvas.loadImage(url_map1);
        const img_match_type = await Canvas.loadImage(LOCAL_URL + "img/" + type + ".png");
        const img_rule = await Canvas.loadImage(LOCAL_URL + "img/" + rule + ".png");
        const img_bg = await Canvas.loadImage(bg_type.link);
        const img_big_rect = await Canvas.loadImage(LOCAL_URL + "img/big_rec.png");
        const img_piti_rect = await Canvas.loadImage(LOCAL_URL + "img/petit_rec.png");

        context.font = '30px splatoon2';
        context.textAlign = 'left';
        context.textBaseline = 'middle';

        //La couleur de fond
        context.fillStyle = COLORS[type];
        context.fillRect(0, 0, X_MAX, Y_MAX);

        //Le filtre de fond
        for (let i = 0; i < bg_type.n; i++) {
            context.drawImage(img_bg, i * bg_type.width, 0, bg_type.width, Y_MAX);
        }

        //Icone du type de match
        context.drawImage(img_match_type, 0, 0, 76, 76);

        //Texte du type de match
        context.fillStyle = 'white';
        context.fillText(text_type, 80, 76 / 2);

        // Ajout des rectangles
        context.drawImage(img_piti_rect, 640, 14);
        context.drawImage(img_big_rect, 10, 76);


        // Ajout de l'icone de la règle
        context.drawImage(img_rule, 522, 200);

        // Ajout du texte de la règle
        context.fillText(text_rule, 572, 204 + 35 / 2);

        // Ajout des images des maps
        context.drawImage(img_map1, 20, 95, 490, 246);

        // Ajout du texte des maps (centré horizontalement et verticalement)
        context.fillText(text_map1, 20, 353 + 26 / 2); // Ajustez les coordonnées pour centrer horizontalement et verticalement

        // Ajout de l'heure
        context.textAlign = 'center';
        context.fillText(text_start + ' - ' + text_end, 640 + 210 / 2, 27 + 26 / 2);

        console.log(CC.FgGreen, "Image créée : Tricolor");

        //Enregistrement de l'image

        const img = canvas.toBuffer('image/png');
        const link = `${LOCAL_URL}img_rotations/tricolor.png`;
        save_image(img, link);

        //Renvoie de l'image avec infos

        return {
            img: canvas.toBuffer('image/png'),
            type: "tricolor",
            link: link,
        };
    } catch (error) {
        console.error(CC.FgRed, 'Erreur lors de la création de l\'image');
        console.log(CC.FgRed, 'Envoie de l\'image undefined');

        //Envoie de l'image undefined
        return {
            img: LINKS_UNDEFINED[type],
            type: type,
            link: LINKS_UNDEFINED[type],
        };
    }
}

async function create_challenge_image(settings, startTime, endTime, noc) {

    try {
        console.log(CC.FgYellow, "Création de l'image : Challenge");

        const stage1 = settings.leagueMatchSetting.vsStages[0]
        const stage2 = settings.leagueMatchSetting.vsStages[1]

        const url_map1 = await get_stage_url_by_id(stage1.vsStageId);
        const url_map2 = await get_stage_url_by_id(stage2.vsStageId);

        const rule = settings.leagueMatchSetting.vsRule.id;
        const bg_type = { n: 2, width: 600, height: 540, link: LOCAL_URL + "img/bg.png" };

        const text_type = get_vf_of(settings.leagueMatchSetting.leagueMatchEvent.id, "events");
        const text_rule = get_vf_of(settings.leagueMatchSetting.vsRule.id, "rules");

        const text_start = get_hours_normal(startTime);
        const text_end = get_hours_normal(endTime);

        const periods = settings.timePeriods;
        for (let i = 0; i < periods.length; i++) {
            periods[i].startTime = get_hours_normal(periods[i].startTime);
            periods[i].endTime = get_hours_normal(periods[i].endTime);
        }


        const text_map1 = get_vf_of(stage1.id, "stages");
        const text_map2 = get_vf_of(stage2.id, "stages");

        const X_MAX = 860;
        const Y_MAX = 540;

        const canvas = Canvas.createCanvas(X_MAX, Y_MAX);
        const context = canvas.getContext('2d');

        const coords_periods = [
            { x: 10, y: 404, w: 210, h: 52 },
            { x: 325, y: 404, w: 210, h: 52 },
            { x: 640, y: 404, w: 210, h: 52 },
            { x: 10, y: 473, w: 210, h: 52 },
            { x: 325, y: 473, w: 210, h: 52 },
            { x: 640, y: 473, w: 210, h: 52 },
        ]

        //Chargement des images
        const img_map1 = await Canvas.loadImage(url_map1);
        const img_map2 = await Canvas.loadImage(url_map2);

        const img_match_type = await Canvas.loadImage(LOCAL_URL + "img/event.png");
        const img_rule = await Canvas.loadImage(LOCAL_URL + "img/" + rule + ".png");
        const img_bg = await Canvas.loadImage(bg_type.link);
        const img_big_rect = await Canvas.loadImage(LOCAL_URL + "img/big_rec.png");
        const img_piti_rect = await Canvas.loadImage(LOCAL_URL + "img/petit_rec.png");


        context.font = '30px splatoon2';
        context.textAlign = 'left';
        context.textBaseline = 'middle';

        //La couleur de fond
        context.fillStyle = COLORS["event"];
        context.fillRect(0, 0, X_MAX, Y_MAX);

        //Le filtre de fond
        for (let i = 0; i < bg_type.n; i++) {
            for (let j = 0; j < bg_type.n; j++) {
                context.drawImage(img_bg, i * bg_type.width, j * bg_type.height, bg_type.width, bg_type.height);
            }
        }

        //Icone du type de match
        context.drawImage(img_match_type, -5, -8, 96, 96);

        //Texte du type de match
        context.fillStyle = 'white';
        context.fillText(text_type, 80, 76 / 2);

        // Ajout des rectangles
        context.drawImage(img_piti_rect, 640, 14);
        context.drawImage(img_big_rect, 10, 76);
        for (let i = 0; i < coords_periods.length; i++) {
            context.drawImage(img_piti_rect, coords_periods[i].x, coords_periods[i].y);
        }

        // Ajout de l'icone de la règle
        context.drawImage(img_rule, 20, 92);

        // Ajout du texte de la règle
        context.fillText(text_rule, 70, 92 + 35 / 2);

        // Ajout des images des maps
        context.drawImage(img_map1, 20, 143, 400, 200);
        context.drawImage(img_map2, 440, 143, 400, 200);

        // Ajout du texte des maps (centré horizontalement et verticalement)
        context.fillText(text_map1, 20, 353 + 26 / 2); // Ajustez les coordonnées pour centrer horizontalement et verticalement
        context.fillText(text_map2, 440, 353 + 26 / 2); // Ajustez les coordonnées pour centrer horizontalement et verticalement

        // Ajout de l'heure
        context.textAlign = 'center';
        context.fillText(text_start + ' - ' + text_end, 640 + 210 / 2, 27 + 26 / 2);

        // Ajout des périodes
        for (let i = 0; i < periods.length; i++) {
            context.fillText(periods[i].startTime + ' - ' + periods[i].endTime, coords_periods[i].x + coords_periods[i].w / 2, coords_periods[i].y + coords_periods[i].h / 2);
        }

        console.log(CC.FgGreen, "Image créée : event");

        //Enregistrement de l'image

        const img = canvas.toBuffer('image/png');
        const link = `${LOCAL_URL}img_rotations/event${noc}.png`;
        save_image(img, link);

        //Renvoie de l'image avec infos

        return {
            img: img,
            type: "event",
            link: link,
        };
    } catch(error) {
        console.error(CC.FgRed, 'Erreur lors de la création de l\'image');
        console.log(CC.FgRed, 'Envoie de l\'image undefined');

        //Envoie de l'image undefined
        return {
            img: LINKS_UNDEFINED[type],
            type: type,
            link: LINKS_UNDEFINED[type],
        };
    }
}

async function create_coop_image(nodes, index) {

    try {
        console.log(CC.FgYellow, "Création de l'image : Salmon Run");

        const rota1 = nodes[index];
        const rota2 = nodes[index + 1];
        const rota3 = nodes[index + 2];

        const settings1 = rota1.setting;
        const settings2 = rota2.setting;
        const settings3 = rota3.setting;

        const url_map1 = settings1.coopStage.image.url;
        const url_map2 = settings2.coopStage.image.url;
        const url_map3 = settings3.coopStage.image.url;


        const boss1 = get_vf_of(settings1.boss.id, "bosses");

        const url_boss1 = LOCAL_URL + "img/" + settings1.boss.id + ".png";
        const url_boss2 = LOCAL_URL + "img/" + settings2.boss.id + ".png";
        const url_boss3 = LOCAL_URL + "img/" + settings3.boss.id + ".png";

        const bg_type = { n: 2, width: 600, height: 403, link: LOCAL_URL + "img/bg_coop.png" };

        const text_start1 = get_date_salmon(rota1.startTime);
        const text_end1 = get_date_salmon(rota1.endTime);
        const text_start2 = get_date_salmon(rota2.startTime);
        const text_end2 = get_date_salmon(rota2.endTime);
        const text_start3 = get_date_salmon(rota3.startTime);
        const text_end3 = get_date_salmon(rota3.endTime);



        const text_map1 = get_vf_of(settings1.coopStage.id, "stages");
        const text_map2 = get_vf_of(settings2.coopStage.id, "stages");
        const text_map3 = get_vf_of(settings3.coopStage.id, "stages");

        const X_MAX = 860;
        const Y_MAX = 840;

        const canvas = Canvas.createCanvas(X_MAX, Y_MAX);
        const context = canvas.getContext('2d');


        //Chargement des images
        const img_map1 = await Canvas.loadImage(url_map1);
        const img_map2 = await Canvas.loadImage(url_map2);
        const img_map3 = await Canvas.loadImage(url_map3);

        const img_boss1 = await Canvas.loadImage(url_boss1);
        const img_boss2 = await Canvas.loadImage(url_boss2);
        const img_boss3 = await Canvas.loadImage(url_boss3);

        const img_match_type = await Canvas.loadImage(LOCAL_URL + "img/salmon.png");

        const img_bg = await Canvas.loadImage(bg_type.link);
        const img_big_rect = await Canvas.loadImage(LOCAL_URL + "img/big_rec.png");
        const img_big_salmon_bg = await Canvas.loadImage(LOCAL_URL + "img/rect_big_salmon.png");
        const img_time_bg = await Canvas.loadImage(LOCAL_URL + "img/rect_time_salmon.png");
        const img_weapon_bg = await Canvas.loadImage(LOCAL_URL + "img/rect_salmon_weapon.png");
        const img_big_weapon_bg = await Canvas.loadImage(LOCAL_URL + "img/rect_salmon_weapon_big.png");
        const img_nom_bg = await Canvas.loadImage(LOCAL_URL + "img/rect_salmon_nom.png");

        const imgs_weapons = [];

        //Chargement des images des armes
        for (let i = 0; i < settings1.weapons.length; i++) {
            imgs_weapons.push(await Canvas.loadImage(settings1.weapons[i].image.url));
        }
        for (let i = 0; i < settings2.weapons.length; i++) {
            imgs_weapons.push(await Canvas.loadImage(settings2.weapons[i].image.url));
        }
        for (let i = 0; i < settings3.weapons.length; i++) {
            imgs_weapons.push(await Canvas.loadImage(settings3.weapons[i].image.url));
        }


        //La couleur de fond
        context.fillStyle = COLORS["coopGrouping"];
        context.fillRect(0, 0, X_MAX, Y_MAX);

        context.font = '30px splatoon2';
        context.textAlign = 'left';
        context.textBaseline = 'middle';
        context.fillStyle = 'white';

        //Le filtre de fond
        for (let i = 0; i < bg_type.n; i++) {
            for (let j = 0; j < 3; j++) {
                context.drawImage(img_bg, i * bg_type.width, j * bg_type.height, bg_type.width, bg_type.height);
            }
        }

        const coords_armes = [
            { x: 432, y: 197, w: 96, h: 96 },
            { x: 536, y: 197, w: 96, h: 96 },
            { x: 639, y: 197, w: 96, h: 96 },
            { x: 743, y: 197, w: 96, h: 96 },

            { x: 486, y: 484, w: 70, h: 70 },
            { x: 562, y: 484, w: 70, h: 70 },
            { x: 637, y: 484, w: 70, h: 70 },
            { x: 714, y: 484, w: 70, h: 70 },

            { x: 486, y: 680, w: 70, h: 70 },
            { x: 562, y: 680, w: 70, h: 70 },
            { x: 637, y: 680, w: 70, h: 70 },
            { x: 714, y: 680, w: 70, h: 70 },
        ]

        // Ajout des rectangles
        //Ajout du réctangle date 1
        context.drawImage(img_time_bg, 441, 14);
        //Ajout du réctangle principal
        context.drawImage(img_big_rect, 10, 76);
        //Ajout du gros réctangle
        context.drawImage(img_big_salmon_bg, 10, 400);
        //Ajout du réctangle date 2
        context.drawImage(img_time_bg, 430, 413);
        //Ajout du réctangle date 3
        context.drawImage(img_time_bg, 430, 609);
        //Ajout du réctangle du nom
        context.drawImage(img_nom_bg, 10, 14);
        //Ajout du réctangle des armes 1
        context.drawImage(img_big_weapon_bg, 432, 185);
        //Ajout du réctangle des armes 2
        context.drawImage(img_weapon_bg, 486, 475);
        //Ajout du réctangle des armes 3
        context.drawImage(img_weapon_bg, 486, 671);

        //Ajout de l'icone du type de match
        context.drawImage(img_match_type, 18, 14);

        //Ajout de l'image de la map 1
        context.drawImage(img_map1, 21, 143, 400, 200);
        //Ajout de l'image de la map 2
        context.drawImage(img_map2, 21, 413, 300, 150);
        //Ajout de l'image de la map 3
        context.drawImage(img_map3, 21, 609, 300, 150);

        //Ajout de l'image du boss 1
        context.drawImage(img_boss1, 21, 92, 40, 40);
        //Ajout de l'image du boss 2
        context.drawImage(img_boss2, 21, 566, 40, 40);
        //Ajout de l'image du boss 3
        context.drawImage(img_boss3, 21, 762, 40, 40);

        //Ajout de l'image des armes
        for (let i = 0; i < imgs_weapons.length; i++) {
            context.drawImage(imgs_weapons[i], coords_armes[i].x, coords_armes[i].y, coords_armes[i].w, coords_armes[i].h);
        }

        //Ajout du texte des maps
        context.fillText(text_map1, 20, 353 + 26 / 2);
        context.fillText(text_map2, 71, 573 + 26 / 2);
        context.fillText(text_map3, 71, 769 + 26 / 2);

        //Ajout du nom du boss
        context.fillText(boss1, 71, 96 + 26 / 2);

        context.textAlign = 'center';

        //Ajout du texte du type de match
        context.fillText("Salmon Run", 70 + 170 / 2, 27 + 26 / 2);

        //Ajout du texte de la date 1
        context.fillText(text_start1 + ' - ' + text_end1, 441 + 409 / 2, 14 + 52 / 2);
        //Ajout du texte de la date 2
        context.fillText(text_start2 + ' - ' + text_end2, 430 + 409 / 2, 413 + 52 / 2);
        //Ajout du texte de la date 3
        context.fillText(text_start3 + ' - ' + text_end3, 430 + 409 / 2, 609 + 52 / 2);


        console.log(CC.FgGreen, "Image créée : coopGrouping");

        //Enregistrement de l'image

        const img = canvas.toBuffer('image/png');
        const link = `${LOCAL_URL}img_rotations/coopGrouping.png`;
        save_image(img, link);

        //Renvoie de l'image avec infos

        return {
            img: img,
            type: "coopGrouping",
            link: link,
        };
    } catch(error) {
        console.error(CC.FgRed, 'Erreur lors de la création de l\'image');
        console.log(CC.FgRed, 'Envoie de l\'image undefined');

        //Envoie de l'image undefined
        return {
            img: LINKS_UNDEFINED[type],
            type: type,
            link: LINKS_UNDEFINED[type],
        };
    }
}



// Fonction pour d'auto-update -------------------------------------------------------------------------------------------------


async function is_sendable() {
    //Récupération de l'heure actuelle
    let date = new Date();

    //Récupération des logs
    let logs = await json_to_js(LOCAL_URL + 'logs.json');

    //Comparaison des date
    let next_date = new Date(logs.next_update);
    if (date >= next_date) {
        logs.next_update = add_two_hours(date.toISOString()).toISOString();
        logs.next_update = set_hours_pair(logs.next_update).toISOString();
        js_to_json(LOCAL_URL + 'logs.json', logs);
        return true;
    }
    return false;
}

async function is_fetchable() {
    //Récupération de l'heure actuelle
    let date = new Date();

    //Récupération des logs
    let logs = await json_to_js(LOCAL_URL + 'logs.json');

    let next_date = new Date(logs.next_fetch);
    //Comparaison des date
    if (date >= next_date) {
        logs.next_fetch = add_two_hours(date.toISOString()).toISOString();
        logs.next_fetch = set_hours_pair(logs.next_fetch).toISOString();
        js_to_json(LOCAL_URL + 'logs.json', logs);
        return true;
    }
    return false;
}

async function save_image(img, link) {
    fs.writeFileSync(link, img);
    const data = json_to_js(LOCAL_URL + 'data_img.json');
    data.push(link);
    js_to_json(LOCAL_URL + 'data_img.json', data);
}

async function auto_update() {

    //Verification de l'heure pour savoir si on doit mettre a jour les rotations

    if (/*await is_fetchable()*/ false) {
        console.log(CC.Reset, "Update des données");
        //Récupération des données
        await fetchSchedules();
        await fetchVF();
    }


    if (/*await is_sendable()*/ true) {
        console.log(CC.Reset, "Update des rotations");

        const date = new Date();
        const data = await get_rotations();
        const regularSchedules = data.regularSchedules.nodes;
        const bankaraSchedules = data.bankaraSchedules.nodes;
        const xSchedules = data.xSchedules.nodes;
        const eventSchedules = data.eventSchedules.nodes;
        const festSchedules = data.festSchedules.nodes;
        const coopGroupingSchedule = data.coopGroupingSchedule;
        const currentFest = data.currentFest;
        var isFest = false
        var rotations_imgs = []; //Variable pour stocker les images des rotations

        
        //Suppression des anciennes images
        console.log(CC.Reset, "Suppression de la liste des dernières images");
        var data_img = await json_to_js(LOCAL_URL + 'data_img.json');
        data_img = []
        js_to_json(LOCAL_URL + 'img_rotations/data_img.json', data_img);

        console.log(CC.Reset, "Suppression effectuée");


        console.log(CC.Reset, "Création des images");

        //Rotation Salmon Run
        const rota_salmon = coopGroupingSchedule.regularSchedules.nodes.concat(coopGroupingSchedule.bigRunSchedules.nodes);
        rota_salmon.sort((a, b) => {
            return new Date(a.startTime) - new Date(b.startTime);
        });


        for (let i = 0; i < rota_salmon.length; i++) { //Pour chaque rotation de Salmon Run
            let starTime = new Date(rota_salmon[i].startTime);
            let endTime = add_two_hours(starTime.toISOString());
            if (isDateBetween(date, starTime, endTime)) { //Trie de la rotation actuelle
                rotations_imgs.push(await create_coop_image(rota_salmon, i));
            }
        }

        //Si il y a un festival en cours
        for (let i = 0; i < festSchedules.length; i++) { //Pour chaque rotation de fest
            let rota = festSchedules[i];
            var settings;
            if (isDateBetween(date, rota.startTime, rota.endTime)) { //Trie de la rotation actuelle
                if (rota.festMatchSettings != null) {
                    isFest = true;
                    for (let j = 0; j < rota.festMatchSettings.length; j++) { //Pour chaque match de la rotation
                        settings = rota.festMatchSettings[j];
                        rotations_imgs.push(await create_classic_image("fest", settings, rota.startTime, rota.endTime));
                    }
                    if (currentFest.state != "FIRST_HALF") {
                        rotations_imgs.push(await create_tricolor_image("fest", settings, currentFest.tricolorStage, rota.startTime, rota.endTime))
                    }
                }
            }
        }

        if (!isFest) {

            //Rotations de match Classique
            for (let i = 0; i < regularSchedules.length; i++) { //Pour chaque rotation de match classique
                let rota = regularSchedules[i];
                if (isDateBetween(date, rota.startTime, rota.endTime)) { //Trie de la rotation actuelle
                    rotations_imgs.push(await create_classic_image("regular", rota.regularMatchSetting, rota.startTime, rota.endTime));
                }
            }

            //Rotations de match Anarchie
            for (let i = 0; i < bankaraSchedules.length; i++) { //Pour chaque rotation de match anarchie
                let rota = bankaraSchedules[i];
                if (isDateBetween(date, rota.startTime, rota.endTime)) { //Trie de la rotation actuelle
                    for (let j = 0; j < rota.bankaraMatchSettings.length; j++) { //Pour chaque match de la rotation
                        let settings = rota.bankaraMatchSettings[j];
                        rotations_imgs.push(await create_classic_image("bankara", settings, rota.startTime, rota.endTime));
                    }
                }
            }

            //Rotation de match X
            for (let i = 0; i < xSchedules.length; i++) { //Pour chaque rotation de match X
                let rota = xSchedules[i];
                if (isDateBetween(date, rota.startTime, rota.endTime)) { //Trie de la rotation actuelle
                    rotations_imgs.push(await create_classic_image("x", rota.xMatchSetting, rota.startTime, rota.endTime));
                }
            }

            //Rotation de challenges
            for (let i = 0; i < eventSchedules.length; i++) { //Pour chaque rotation de match challenge
                let rota = eventSchedules[i];
                for (let j = 0; j < rota.timePeriods.length; j++) { //Pour chaque période de la rotation
                    if (isDateBetween(date, rota.timePeriods[j].startTime, rota.timePeriods[j].endTime)) { //Trie de la rotation actuelle
                        rotations_imgs.push(await create_challenge_image(rota, rota.timePeriods[j].startTime, rota.timePeriods[j].endTime, i));
                    }
                }
            }
        }

        //Trie des images par type
        console.log(CC.Reset, "Trie des images");
        rotations_imgs.sort((a, b) => {
            return ORDER[a.type] - ORDER[b.type];
        });


        //Changement les type pour correspondre au type d'envoie
        for (let i = 0; i < rotations_imgs.length; i++) {
            rotations_imgs[i].type = TYPE_ENVOIE[rotations_imgs[i].type];
        }

        //Envoie des images
        console.log(CC.Reset, "Envoie des rotations actuelles : " + date);
        console.log(CC.Reset, "Nombre d'image : " + rotations_imgs.length);
        for (let i = 0; i < rotations_imgs.length; i++) {
            await send_to_servers(rotations_imgs[i]);
        }
    }
}


// Fonction GET --------------------------------------------------------------------------------------------------


function get_vf_of(id, type) {
    let vf = json_to_js(LOCAL_URL + 'splatoon_data.json');
    let name = "";
    Object.keys(vf[type]).forEach(key => {
        if (key == id) {
            name = vf[type][key].name;
        }
    });
    return name;
}

async function get_stage_url_by_id(id) {
    stages = await get_rotations();
    stages = stages.vsStages.nodes
    for (let i = 0; i < stages.length; i++) {
        if (stages[i].vsStageId == id) {
            return stages[i].originalImage.url;
        }
    }
}

function get_hours_normal(isoString) {
    const date = new Date(isoString);

    // Récupérer l'heure et les minutes
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    // Retourner l'heure et les minutes formatées
    return `${hours}:${minutes}`;
}

function get_date_salmon(isoString) {
    const date = new Date(isoString);

    // Récupérer le mois, le jour, l'heure et les minutes
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    // Retourner la date formatée
    return `${day}/${month} ${hours}:${minutes}`;
}


//Démarrage du programme ---------------------------------------------------------------------------------------------

function startInterval() {
    console.log(CC.Reset, "Lancement de la boucle...");

    // Définit un intervalle de 1 minute pour verifier 
    setInterval(() => {
        auto_update();
    }, 5 * 1000); // 5 seconde = 5 secondes * 1000 ms
}

//startInterval();
auto_update();

module.exports = {
    startInterval,
    auto_update
}
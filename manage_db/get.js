const { connection, disconnection } = require('./db_connection');


// Fonction pour récupérer les webhooks
async function get_webhooks(request = "SELECT url FROM webhook") {
    /**
     * @param {string} request - Requête SQL à exécuter
     * @returns {Array} - Tableau des webhooks
    */

    // Se connecter à MySQL
    const con = await connection();

    // Promettre la requête
    const queryPromise = new Promise((resolve, reject) => {
        con.query(request, (err, result, fields) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
    const resultat = await queryPromise; // Attendre que la requête soit terminée

    // Se déconnecter de MySQL
    await disconnection(con); // Attendre que la connexion soit fermée

    // Créer un tableau des webhooks (donc juste les URL)
    let webhooks = [];
    for (let i = 0; i < resultat.length; i++) {
        webhooks.push(resultat[i].url);
    }

    return webhooks;
}


// Les fonctions suivantes sont des raccourcis pour les types de webhooks
// Elles appellent la fonction get_webhooks() avec une requête SQL spécifique
async function get_normal_webhooks() {
    const webhooks = await get_webhooks("SELECT url FROM webhook WHERE type = 'normal'");
    return webhooks;
}

async function get_salmon_webhooks() {
    const webhooks = await get_webhooks("SELECT url FROM webhook WHERE type = 'salmon'");
    return webhooks;
}

async function get_event_webhooks() {
    const webhooks = await get_webhooks("SELECT url FROM webhook WHERE type = 'event'");
    return webhooks;
}


// Fonction pour chercher les webhooks en fonction de paramètres

async function get_webhooks_by_params(params) {
    /**
     * @param {Object} params - Paramètres de recherche
     * @returns {Array} - Tableau des webhooks
    */

    // Créer la requête SQL
    let request = "SELECT url FROM webhook WHERE ";
    let keys = Object.keys(params);
    for (let i = 0; i < keys.length; i++) {
        request += keys[i] + " = '" + params[keys[i]] + "'";
        if (i < keys.length - 1) {
            request += " AND ";
        }
    }

    // Récupérer les webhooks
    const webhooks = await get_webhooks(request);
    return webhooks;
}

async function get_id_by_params(params) {

    let request = "SELECT id FROM webhook WHERE ";
    let keys = Object.keys(params);
    for (let i = 0; i < keys.length; i++) {
        request += keys[i] + " = '" + params[keys[i]] + "'";
        if (i < keys.length - 1) {
            request += " AND ";
        }
    }

    const con = await connection();

    const queryPromise = new Promise((resolve, reject) => {
        con.query(request, (err, result, fields) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    }
    );
    const resultat = await queryPromise;

    await disconnection(con);

    let response = [];
    for (i in resultat) {
        response.push(resultat[i].id);
    }

    return response;
}


// Fonction pour récupérer une ligne

async function get_table_by_id(id) {
    /**
     * @param {number} id - ID de la ligne à récupérer
     * @returns {Object} - Ligne de la table
    */

    // Créer la requête SQL
    let request = "SELECT * FROM webhook WHERE id = " + id;

    // Se connecter à MySQL
    const con = await connection();

    // Promettre la requête
    const queryPromise = new Promise((resolve, reject) => {
        con.query(request, (err, result, fields) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
    const resultat = await queryPromise; // Attendre que la requête soit terminée

    // Se déconnecter de MySQL
    await disconnection(con); // Attendre que la connexion soit fermée

    return resultat;
}


module.exports = {
    get_webhooks,
    get_normal_webhooks,
    get_salmon_webhooks,
    get_event_webhooks,
    get_webhooks_by_params,
    get_id_by_params,
    get_table_by_id
};
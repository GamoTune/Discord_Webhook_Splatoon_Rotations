const { connection, disconnection } = require('./db_connection');


// Fonction pour récupérer les webhooks
async function post_webhooks(request = "INSERT INTO webhook () VALUES ()") {

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

    await disconnection(con); // Attendre que la connexion soit fermée

    return queryPromise;
}


async function post_normal_webhooks(info) {
    const webhooks = await post_webhooks(`INSERT INTO webhook (url, type, channel, server) VALUES ('${info.url}', 'normal', '${info.channel}', '${info.server}')`);
    return webhooks;
}

async function post_salmon_webhooks(info) {
    const webhooks = await post_webhooks(`INSERT INTO webhook (url, type, channel, server) VALUES ('${info.url}', 'salmon', '${info.channel}', '${info.server}')`);
    return webhooks;
}

async function post_event_webhooks(info) {
    const webhooks = await post_webhooks(`INSERT INTO webhook (url, type, channel, server) VALUES ('${info.url}', 'event', '${info.channel}', '${info.server}')`);
    return webhooks;
}


module.exports = {
    post_webhooks,
    post_normal_webhooks,
    post_salmon_webhooks,
    post_event_webhooks
};
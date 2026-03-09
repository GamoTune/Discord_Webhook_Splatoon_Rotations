const { connection, disconnection } = require('./db_connection');


// Fonction pour récupérer les webhooks
async function delete_webhooks(id) {
    /**
     * @param {string} id - ID du webhook à supprimer
     * @returns {Object} - Message de confirmation
     */

    let request = "DELETE FROM webhook WHERE id = " + id;

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

    await disconnection(con); // Attendre que la connexion soit fermée

    return queryPromise;
}


module.exports = { delete_webhooks };
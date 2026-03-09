const mysql = require('mysql');
const { CC } = require('../console_color');

// Fonction pour se connecter et se déconnecter de MySQL
async function connection() {
    const con = mysql.createConnection({
        host: '127.0.0.1',
        port: '8889',
        user: 'root',
        password: 'root',
        database: 'ganager'
    });

    // Promettre la connexion
    const connectPromise = new Promise((resolve, reject) => {
        con.connect((err) => {
            if (err) {
                reject('Erreur de connexion : ' + err.stack);
            } else {
                resolve();
            }
        });
    });

    // Attendre que la connexion soit établie
    await connectPromise;
    return con;
}

async function disconnection(con) {
    // Promettre la fermeture de la connexion
    const endPromise = new Promise((resolve, reject) => {
        con.end((err) => {
            if (err) {
                reject('Erreur de déconnexion : ' + err.stack);
            } else {
                resolve();
            }
        });
    });
    
    await endPromise; // Attendre que la connexion soit fermée

    return;
}

module.exports = { connection, disconnection };
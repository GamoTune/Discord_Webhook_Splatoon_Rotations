const fs = require('fs'); //Importation du module fs (file system) pour la lecture et l'écriture de fichiers

function json_to_js(file){
    const file_json = fs.readFileSync(file); //Lecture du fichier JSON
    const data = JSON.parse(file_json); //Conversion du fichier JSON en objet JS
    return data
}

function js_to_json(url, data){
    const json = JSON.stringify(data); //Conversion de l'objet JS en fichier JSON
    fs.writeFileSync(url, json); //Ecriture du fichier JSON
}

module.exports = { json_to_js, js_to_json } //Exportation des fonctions
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <title>Splatoon rotation</title>
</head>
<body>
    <h1>Rotation actuelle Splatoon</h1>
</body>
</html>

<?php
// Chemin vers le fichier JSON (un répertoire en arrière)
$jsonFilePath = 'data_img.json';


// Vérifier si le fichier existe
if (!file_exists($jsonFilePath)) {
    die("Le fichier JSON n'existe pas.");
}

// Lire le contenu du fichier JSON
$jsonContent = file_get_contents($jsonFilePath);

// Décoder le contenu JSON en un tableau PHP
$imageLinks = json_decode($jsonContent, true);

// Vérifier si le décodage a réussi et que le contenu est un tableau
if ($imageLinks === null || !is_array($imageLinks)) {
    die("Erreur lors du décodage du fichier JSON.");
}

// Afficher les liens des images
foreach ($imageLinks as $link) {
    $path = "../../$link";
    echo "<img src=$path alt='Image'>";
}

?>
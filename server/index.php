<?php
// Si le formulaire a été soumis
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupération des données du formulaire
    $text1 = $_POST['text1'] ?? '';
    $text2 = $_POST['text2'] ?? '';
    $text3 = $_POST['text3'] ?? '';

    // Création de l'objet avec les textes
    $data = array(
        'pass' => '12367/EAZv6k&2',
        'normal' => $text1,
        'event' => $text2,
        'coop' => $text3
    );

    // Conversion en JSON pour l'envoi
    $jsonData = json_encode($data);

    // URL du serveur cible
    $url = 'https://86.205.85.28:50000/splatoon/api/add-webhooks'; // Remplacez par l'URL de votre serveur

    // Initialisation de la requête cURL
    $ch = curl_init($url);
    
    // Configuration de la requête POST
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json',
        'Content-Length: ' . strlen($jsonData)
    ));

    // Exécution de la requête et récupération de la réponse
    $response = curl_exec($ch);
    curl_close($ch);

    // Affichage de la réponse pour vérifier l'envoi
    echo "Réponse du serveur : " . $response;
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulaire simple</title>
</head>
<body>
    <h1>Formulaire d'ajout de webhooks discord pour rotations splatoon</h1>
    <form method="POST" action="">
        <label for="text1">Salon pour les rotations normal :</label><br>
        <input type="text" id="text1" name="text1" required><br><br>

        <label for="text2">Salon pour les rotations d'event :</label><br>
        <input type="text" id="text2" name="text2" required><br><br>

        <label for="text3">Salon pour les rotations salmon run :</label><br>
        <input type="text" id="text3" name="text3" required><br><br>

        <input type="submit" value="Envoyer">
    </form>
</body>
</html>
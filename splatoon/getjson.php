<?php


$player = $_GET['player'];
$k = $_GET['k'];
$d = $_GET['d'];
$a = $_GET['a'];

$datas=$player."\n".$k."\n".$d."\n".$a."\n";
echo("retour de getjson.php :" . $player . " " . $k . " " . $d . " " . $a);

$file = "/home/gamoonr/cs_scores_players/".$player.".txt";
file_put_contents($file, $datas);

?>
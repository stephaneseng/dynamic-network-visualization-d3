<?php

define('DB_DSN', 'sqlite:../../var/data/sqlite.db');

$from = $_GET['from'];
$to = $_GET['to'];

function getNodes($from, $to)
{
    $query = "SELECT id
FROM nodes
WHERE date >= :from AND date < :to
ORDER BY date ASC";

    $dbh = new PDO(DB_DSN);
    $sth = $dbh->prepare($query);
    $sth->execute([
        ':from' => $from,
        ':to' => $to,
    ]);

    return $sth->fetchAll(PDO::FETCH_OBJ);
}

function getLinks($from, $to)
{
    $query = "SELECT source, target
FROM links
WHERE date >= :from AND date < :to
ORDER BY date ASC";

    $dbh = new PDO(DB_DSN);
    $sth = $dbh->prepare($query);
    $sth->execute([
        ':from' => $from,
        ':to' => $to,
    ]);

    $links = [];
    while ($link = $sth->fetch(PDO::FETCH_OBJ)) {
        $links[] = [
            'source' => $link->source,
            'target' => $link->target,
        ];
    }

    return $links;
}

$nodes = getNodes($from, $to);
$links = getLinks($from, $to);

header('Content-Type: application/json');
echo json_encode(['nodes' => $nodes, 'links' => $links]);

<?php
/** En-tête commun. Variables attendues : $title (string), $cart (MiniShop\Cart). */
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= e($title) ?> — MiniShop</title>
    <link rel="stylesheet" href="/style.css">
</head>
<body>
<header class="site-header">
    <a class="brand" href="/"><img src="/img/logo.svg" width="32" height="32"> MiniShop</a>
    <nav aria-label="Navigation principale">
        <a href="/">Catalogue</a>
        <a href="/cart.php">Panier (<?= $cart->count() ?>)</a>
    </nav>
    <time class="today" data-testid="date-du-jour" datetime="<?= date('Y-m-d') ?>"><?= date('d/m/Y') ?></time>
</header>
<main>

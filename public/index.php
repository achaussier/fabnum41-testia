<?php
// Catalogue : liste des produits, ajout au panier.

declare(strict_types=1);

require __DIR__ . '/../templates/init.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $sku = (string) ($_POST['sku'] ?? '');
    if ($catalog->has($sku)) {
        $cart->add($sku);
        saveCart($cart);
    }
    redirect('/');
}

$title = 'Catalogue';
require __DIR__ . '/../templates/header.php';
?>
<h1>Catalogue</h1>

<ul class="products">
<?php foreach ($catalog->all() as $product): ?>
    <li class="product">
        <img src="/img/<?= e($product->image) ?>" alt="" width="160" height="120">
        <h2><?= e($product->name) ?></h2>
        <p class="price"><?= euros($product->price) ?></p>
        <form method="post" action="/">
            <input type="hidden" name="sku" value="<?= e($product->sku) ?>">
            <button type="submit" aria-label="Ajouter <?= e($product->name) ?>">Ajouter</button>
        </form>
    </li>
<?php endforeach ?>
</ul>
<?php require __DIR__ . '/../templates/footer.php';

<?php
// Panier : lignes, code promo, montants.

declare(strict_types=1);

use MiniShop\CouponValidator;
use MiniShop\InvalidCouponException;

require __DIR__ . '/../templates/init.php';

$couponError = null;
$typedCode   = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'remove') {
        $cart->remove((string) ($_POST['sku'] ?? ''));
        saveCart($cart);
        redirect('/cart.php');
    }

    if ($action === 'coupon') {
        $typedCode = (string) ($_POST['code'] ?? '');
        try {
            // Un seul coupon par commande : le nouveau code remplace l'ancien.
            $coupon = (new CouponValidator())->validate($typedCode);
            $_SESSION['coupon'] = $coupon->code;
            redirect('/cart.php');
        } catch (InvalidCouponException $exception) {
            $couponError = $exception->getMessage();
        }
    }

    if ($action === 'remove-coupon') {
        unset($_SESSION['coupon']);
        redirect('/cart.php');
    }
}

$amounts = summary($cart, $coupon, $calculator);

$title = 'Votre panier';
require __DIR__ . '/../templates/header.php';
?>
<h1>Votre panier</h1>

<section data-testid="cart" class="cart">
<?php if ($cart->isEmpty()): ?>
    <p>Votre panier est vide.</p>
    <p><a href="/">Retour au catalogue</a></p>
<?php else: ?>
    <table>
        <thead>
            <tr>
                <th scope="col">Produit</th>
                <th scope="col" class="num">Prix unitaire</th>
                <th scope="col" class="num">Quantité</th>
                <th scope="col" class="num">Total</th>
                <th scope="col"><span class="visually-hidden">Actions</span></th>
            </tr>
        </thead>
        <tbody>
        <?php foreach ($cart->lines() as $line): ?>
            <tr data-testid="cart-line">
                <th scope="row"><?= e($line['name']) ?></th>
                <td class="num"><?= euros($line['unitPrice']) ?></td>
                <td class="num"><?= $line['quantity'] ?></td>
                <td class="num"><?= euros($line['lineTotal']) ?></td>
                <td>
                    <form method="post" action="/cart.php">
                        <input type="hidden" name="action" value="remove">
                        <input type="hidden" name="sku" value="<?= e($line['sku']) ?>">
                        <button type="submit" class="link" aria-label="Retirer <?= e($line['name']) ?>">Retirer</button>
                    </form>
                </td>
            </tr>
        <?php endforeach ?>
        </tbody>
    </table>

    <form method="post" action="/cart.php" class="coupon">
        <input type="hidden" name="action" value="coupon">
        <label for="code">Code promo</label>
        <input type="text" id="code" name="code" value="<?= e($typedCode) ?>" autocomplete="off">
        <button type="submit" class="secondary">Appliquer</button>
    </form>
    <?php if ($couponError !== null): ?>
        <p class="error" role="alert" data-testid="coupon-error"><?= e($couponError) ?></p>
    <?php endif ?>

    <dl class="summary">
        <?php if ($coupon !== null): ?>
        <div class="discount" data-testid="cart-discount-line">
            <dt>Réduction (<?= e($coupon->code) ?>)</dt>
            <dd data-testid="cart-discount"><?= $coupon->freeShipping ? 'Livraison offerte' : euros(-$amounts['discount']) ?></dd>
        </div>
        <?php endif ?>
        <div>
            <dt>Total des articles</dt>
            <dd data-testid="cart-total"><?= euros($amounts['articles']) ?></dd>
        </div>
        <div>
            <dt>Livraison</dt>
            <dd data-testid="cart-shipping"><?= $amounts['shipping'] === 0 ? 'Offerte' : euros($amounts['shipping']) ?></dd>
        </div>
        <div class="total">
            <dt>Total à payer</dt>
            <dd data-testid="order-total"><?= euros($amounts['total']) ?></dd>
        </div>
    </dl>

    <?php if ($coupon !== null): ?>
    <form method="post" action="/cart.php">
        <input type="hidden" name="action" value="remove-coupon">
        <button type="submit" class="link">Retirer le code promo</button>
    </form>
    <?php endif ?>

    <p class="actions"><a class="button" href="/checkout.php">Passer la commande</a></p>
<?php endif ?>
</section>
<?php require __DIR__ . '/../templates/footer.php';

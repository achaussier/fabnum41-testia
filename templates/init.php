<?php
/**
 * Point d'entrée commun des pages de public/ : autoload, session, panier et coupon courants.
 * Définit $catalog, $cart, $coupon et $calculator.
 */

declare(strict_types=1);

use MiniShop\Cart;
use MiniShop\Catalog;
use MiniShop\Coupon;
use MiniShop\CouponValidator;
use MiniShop\InvalidCouponException;
use MiniShop\Money;
use MiniShop\PriceCalculator;

require __DIR__ . '/../vendor/autoload.php';

date_default_timezone_set('Europe/Paris');
session_start();

$catalog    = new Catalog();
$calculator = new PriceCalculator();
$cart       = new Cart($catalog, $_SESSION['cart'] ?? []);

$coupon = null;
if (isset($_SESSION['coupon'])) {
    try {
        $coupon = (new CouponValidator())->validate($_SESSION['coupon']);
    } catch (InvalidCouponException) {
        unset($_SESSION['coupon']);
    }
}

/** Échappe un texte avant de l'afficher dans le HTML. */
function e(string $text): string
{
    return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
}

/** 1290 → « 12,90 € » */
function euros(int $cents): string
{
    return Money::format($cents);
}

function saveCart(Cart $cart): void
{
    $_SESSION['cart'] = $cart->toArray();
}

function redirect(string $url): never
{
    header('Location: ' . $url, true, 303);
    exit;
}

/**
 * Détail des montants affichés dans le panier et la commande.
 *
 * @return array{subtotal: int, discount: int, articles: int, shipping: int, total: int}
 */
function summary(Cart $cart, ?Coupon $coupon, PriceCalculator $calculator): array
{
    $subtotal = $cart->subtotal();
    $articles = $calculator->applyCoupon($subtotal, $coupon);
    $total    = $calculator->total($cart, $coupon);

    return [
        'subtotal' => $subtotal,
        'discount' => $subtotal - $articles,
        'articles' => $articles,
        'shipping' => $total - $articles,
        'total'    => $total,
    ];
}

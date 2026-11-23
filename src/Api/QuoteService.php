<?php

declare(strict_types=1);

namespace MiniShop\Api;

use MiniShop\Cart;
use MiniShop\Catalog;
use MiniShop\CouponValidator;
use MiniShop\ExpiredCouponException;
use MiniShop\InvalidCouponException;
use MiniShop\PriceCalculator;
use MiniShop\Product;

/** Calcule un devis à partir d'un corps de requête {lines, coupon?}. */
final class QuoteService
{
    public function __construct(
        private readonly Catalog $catalog = new Catalog(),
        private readonly PriceCalculator $calculator = new PriceCalculator(),
        private readonly CouponValidator $coupons = new CouponValidator(),
    ) {
    }

    /** Référence d'un produit telle que l'API l'expose : en minuscules. */
    public static function sku(Product $product): string
    {
        return strtolower($product->sku);
    }

    public function find(string $sku): Product
    {
        $sku = strtoupper($sku);
        if (!$this->catalog->has($sku)) {
            throw new ApiException(404, 'produit_inconnu', 'Produit inconnu');
        }
        return $this->catalog->get($sku);
    }

    /**
     * @param array<mixed> $body corps JSON décodé
     * @return array{subtotal: int, discount: int, shipping: int, total: int}
     */
    public function quote(array $body): array
    {
        $lines = $body['lines'] ?? null;
        if (!is_array($lines) || !array_is_list($lines) || $lines === []) {
            throw new ApiException(422, 'panier_vide', 'Le panier doit contenir au moins une ligne');
        }

        $cart = new Cart($this->catalog);
        $quantities = [];
        foreach ($lines as $line) {
            if (!is_array($line) || !is_string($line['sku'] ?? null) || !is_int($line['qty'] ?? null)) {
                throw new ApiException(422, 'ligne_invalide', 'Chaque ligne doit contenir sku (texte) et qty (entier)');
            }
            $qty = $line['qty'];
            if ($qty < 0 || $qty > Cart::MAX_QUANTITY) {
                throw new ApiException(422, 'quantite_invalide', 'La quantité doit être comprise entre 1 et 10');
            }
            $product = $this->find($line['sku']);

            $quantities[$product->sku] = ($quantities[$product->sku] ?? 0) + $qty;
            if ($quantities[$product->sku] > Cart::MAX_QUANTITY) {
                throw new ApiException(422, 'quantite_invalide', 'La quantité doit être comprise entre 1 et 10');
            }
            if ($qty > 0) {
                $cart->add($product->sku, $qty);
            }
        }

        $coupon = null;
        if (array_key_exists('coupon', $body)) {
            if (!is_string($body['coupon'])) {
                throw new ApiException(422, 'coupon_invalide', 'Code promo invalide');
            }
            try {
                $coupon = $this->coupons->validate($body['coupon']);
            } catch (ExpiredCouponException $exception) {
                throw new ApiException(410, 'coupon_expire', $exception->getMessage());
            } catch (InvalidCouponException $exception) {
                throw new ApiException(422, 'coupon_invalide', $exception->getMessage());
            }
        }

        $subtotal = $cart->subtotal();
        $afterCoupon = $this->calculator->applyCoupon($subtotal, $coupon);
        $total = $this->calculator->total($cart, $coupon);

        return [
            'subtotal' => $subtotal,
            'discount' => $subtotal - $afterCoupon,
            'shipping' => $total - $afterCoupon,
            'total'    => $total,
        ];
    }
}

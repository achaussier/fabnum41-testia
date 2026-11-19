<?php

declare(strict_types=1);

namespace MiniShop;

final class PriceCalculator
{
    public const FREE_SHIPPING_FROM = 5000; // 50,00 €
    public const SHIPPING_COST = 490;       // 4,90 €

    /** Frais de livraison pour un sous-total donné (après coupon). */
    public function shipping(int $subtotal): int
    {
        if ($subtotal > self::FREE_SHIPPING_FROM) {
            return 0;
        }
        return self::SHIPPING_COST;
    }

    /** Sous-total une fois la réduction du coupon appliquée. */
    public function applyCoupon(int $subtotal, ?Coupon $coupon): int
    {
        if ($coupon === null || $coupon->percentOff === 0) {
            return $subtotal;
        }
        $discount = intdiv($subtotal * $coupon->percentOff, 100);

        return $subtotal - $discount;
    }

    /** Montant à payer : articles après coupon + livraison. */
    public function total(Cart $cart, ?Coupon $coupon): int
    {
        $subtotal = $this->applyCoupon($cart->subtotal(), $coupon);
        $shipping = $coupon?->freeShipping ? 0 : $this->shipping($subtotal);

        return $subtotal + $shipping;
    }
}

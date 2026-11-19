<?php

declare(strict_types=1);

namespace MiniShop;

final class CouponValidator
{
    private const EXPIRED = ['NOEL2025'];

    /**
     * @throws InvalidCouponException si le code est expiré ou inconnu (le message est affiché au client)
     */
    public function validate(string $code): Coupon
    {
        $code = mb_strtoupper(trim($code));

        if (in_array($code, self::EXPIRED, true)) {
            throw new InvalidCouponException('Ce code a expiré');
        }

        return match ($code) {
            'BIENVENUE10' => new Coupon($code, percentOff: 10),
            'LIVRAISON'   => new Coupon($code, freeShipping: true),
            default       => throw new InvalidCouponException('Code promo invalide'),
        };
    }
}

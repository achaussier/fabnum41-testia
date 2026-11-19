<?php

declare(strict_types=1);

namespace MiniShop;

final class Coupon
{
    public function __construct(
        public readonly string $code,
        public readonly int $percentOff = 0,
        public readonly bool $freeShipping = false,
    ) {
    }
}

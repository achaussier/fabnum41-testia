<?php

declare(strict_types=1);

namespace MiniShop;

final class Product
{
    public function __construct(
        public readonly string $sku,
        public readonly string $name,
        public readonly int $price, // en centimes
        public readonly string $image,
    ) {
    }
}

<?php

declare(strict_types=1);

namespace MiniShop;

use InvalidArgumentException;

final class Catalog
{
    /** @var array<string, Product> */
    private array $products = [];

    public function __construct()
    {
        $list = [
            new Product('CARNET-A5', 'Carnet A5', 1290, 'carnet.svg', 40),
            new Product('STYLO-PLUME', 'Stylo plume', 2450, 'stylo.svg', 12),
            new Product('AGENDA', 'Agenda semainier', 1800, 'agenda.svg', 25),
            new Product('CRAYONS', 'Lot de 3 crayons', 450, 'crayons.svg', 80),
            new Product('TROUSSE', 'Trousse en toile', 990, 'trousse.svg', 18),
            new Product('LAMPE', 'Lampe de bureau', 5000, 'lampe.svg', 6),
        ];
        foreach ($list as $product) {
            $this->products[$product->sku] = $product;
        }
    }

    /** @return list<Product> */
    public function all(): array
    {
        return array_values($this->products);
    }

    public function has(string $sku): bool
    {
        return isset($this->products[$sku]);
    }

    public function get(string $sku): Product
    {
        if (!$this->has($sku)) {
            throw new InvalidArgumentException("Produit inconnu : $sku");
        }
        return $this->products[$sku];
    }
}

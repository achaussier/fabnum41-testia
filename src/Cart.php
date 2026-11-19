<?php

declare(strict_types=1);

namespace MiniShop;

use InvalidArgumentException;

final class Cart
{
    public const MAX_QUANTITY = 10;

    private Catalog $catalog;

    /** @var array<string, int> quantité par référence produit */
    private array $items = [];

    /** @param array<string, int> $items contenu initial (relu depuis la session) */
    public function __construct(?Catalog $catalog = null, array $items = [])
    {
        $this->catalog = $catalog ?? new Catalog();
        foreach ($items as $sku => $qty) {
            $this->add((string) $sku, (int) $qty);
        }
    }

    public function add(string $sku, int $qty = 1): void
    {
        if ($qty <= 0) {
            throw new InvalidArgumentException('La quantité doit être supérieure à zéro');
        }
        $this->catalog->get($sku); // lève une exception si le produit n'existe pas

        $this->items[$sku] = min(self::MAX_QUANTITY, ($this->items[$sku] ?? 0) + $qty);
    }

    public function remove(string $sku): void
    {
        unset($this->items[$sku]);
    }

    /**
     * @return list<array{sku: string, name: string, unitPrice: int, quantity: int, lineTotal: int}>
     */
    public function lines(): array
    {
        $lines = [];
        foreach ($this->items as $sku => $qty) {
            $product = $this->catalog->get($sku);
            $lines[] = [
                'sku'       => $sku,
                'name'      => $product->name,
                'unitPrice' => $product->price,
                'quantity'  => $qty,
                'lineTotal' => $product->price * $qty,
            ];
        }
        return $lines;
    }

    public function subtotal(): int
    {
        return array_sum(array_column($this->lines(), 'lineTotal'));
    }

    /** Nombre total d'articles (somme des quantités). */
    public function count(): int
    {
        return array_sum($this->items);
    }

    public function isEmpty(): bool
    {
        return $this->items === [];
    }

    /** @return array<string, int> de quoi ranger le panier en session */
    public function toArray(): array
    {
        return $this->items;
    }
}

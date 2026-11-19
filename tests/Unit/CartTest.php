<?php

declare(strict_types=1);

use MiniShop\Cart;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

final class CartTest extends TestCase
{
    #[Test]
    public function unPanierNeufEstVide(): void
    {
        $panier = new Cart();

        $this->assertSame([], $panier->lines());
        $this->assertSame(0, $panier->subtotal());
    }

    #[Test]
    public function ajouterUnProduitCreeUneLigne(): void
    {
        $panier = new Cart();

        $panier->add('CARNET-A5', 2);

        $this->assertSame([[
            'sku'       => 'CARNET-A5',
            'name'      => 'Carnet A5',
            'unitPrice' => 1290,
            'quantity'  => 2,
            'lineTotal' => 2580,
        ]], $panier->lines());
    }

    #[Test]
    public function ajouterUnProduitDejaPresentAugmenteSaQuantite(): void
    {
        $panier = new Cart();
        $panier->add('CARNET-A5');

        $panier->add('CARNET-A5', 2);

        $this->assertCount(1, $panier->lines());
        $this->assertSame(3, $panier->lines()[0]['quantity']);
    }

    #[Test]
    public function laQuantiteNeDepassePasDix(): void
    {
        $panier = new Cart();
        $panier->add('CARNET-A5', 8);

        $panier->add('CARNET-A5', 5);

        $this->assertSame(10, $panier->lines()[0]['quantity']);
    }

    /** @return array<string, array{int}> */
    public static function quantitesInterdites(): array
    {
        return [
            'zéro'     => [0],
            'négative' => [-1],
        ];
    }

    #[Test]
    #[DataProvider('quantitesInterdites')]
    public function uneQuantiteNulleOuNegativeEstRefusee(int $quantite): void
    {
        $panier = new Cart();

        $this->expectException(InvalidArgumentException::class);

        $panier->add('CARNET-A5', $quantite);
    }

    #[Test]
    public function unProduitInconnuEstRefuse(): void
    {
        $panier = new Cart();

        $this->expectException(InvalidArgumentException::class);

        $panier->add('INCONNU');
    }

    #[Test]
    public function retirerUnProduitSupprimeSaLigne(): void
    {
        $panier = new Cart();
        $panier->add('CARNET-A5');
        $panier->add('STYLO-PLUME');

        $panier->remove('CARNET-A5');

        $this->assertSame(['STYLO-PLUME'], array_column($panier->lines(), 'sku'));
    }

    #[Test]
    public function leSousTotalAdditionneLesLignes(): void
    {
        $panier = new Cart();
        $panier->add('CARNET-A5', 2);  // 2 × 12,90 €
        $panier->add('STYLO-PLUME');   // 24,50 €

        $this->assertSame(5030, $panier->subtotal());
    }
}

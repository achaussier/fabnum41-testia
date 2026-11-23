<?php

// ÉCART CODE / SPEC : SPEC.md dit « livraison offerte à partir de 50,00 € ».
// Pour 5000 centimes pile, shipping() renvoie 490 au lieu de 0.
// Le cas « pile 50 euros » ci-dessous suit la spec : il échoue tant que le code n'est pas corrigé.

declare(strict_types=1);

use MiniShop\Cart;
use MiniShop\Coupon;
use MiniShop\PriceCalculator;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

final class PriceCalculatorTest extends TestCase
{
    /** @return array<string, array{int, int}> */
    public static function montants(): array
    {
        return [
            'panier vide'      => [0,     490],
            'petit panier'     => [1290,  490],
            'juste en dessous' => [4999,  490],
            'pile 50 euros'    => [5000,  0],
            'au-dessus'        => [5001,  0],
            'gros panier'      => [25000, 0],
        ];
    }

    #[Test]
    #[DataProvider('montants')]
    public function fraisDeLivraison(int $sousTotal, int $attendu): void
    {
        $calc = new PriceCalculator();

        $this->assertSame($attendu, $calc->shipping($sousTotal));
    }

    /** @return array<string, array{int, ?Coupon, int}> */
    public static function reductions(): array
    {
        $bienvenue = new Coupon('BIENVENUE10', percentOff: 10);
        $livraison = new Coupon('LIVRAISON', freeShipping: true);

        return [
            'sans coupon'                           => [1290, null,       1290],
            'BIENVENUE10 sur un montant rond'       => [2000, $bienvenue, 1800],
            'BIENVENUE10 arrondi (réduction 1,29)'  => [1295, $bienvenue, 1166],
            'BIENVENUE10 sur 1 centime'             => [1,    $bienvenue, 1],
            'BIENVENUE10 sur un panier vide'        => [0,    $bienvenue, 0],
            'LIVRAISON ne change pas le sous-total' => [1290, $livraison, 1290],
        ];
    }

    #[Test]
    #[DataProvider('reductions')]
    public function sousTotalApresCoupon(int $sousTotal, ?Coupon $coupon, int $attendu): void
    {
        $calc = new PriceCalculator();

        $this->assertSame($attendu, $calc->applyCoupon($sousTotal, $coupon));
    }

    #[Test]
    public function totalSansCouponAjouteLaLivraison(): void
    {
        $panier = new Cart();
        $panier->add('CARNET-A5'); // 12,90 €

        $total = (new PriceCalculator())->total($panier, null);

        $this->assertSame(1290 + 490, $total);
    }

    #[Test]
    public function totalAvecLivraisonOfferteParLeCoupon(): void
    {
        $panier = new Cart();
        $panier->add('CARNET-A5');

        $total = (new PriceCalculator())->total($panier, new Coupon('LIVRAISON', freeShipping: true));

        $this->assertSame(1290, $total);
    }

    #[Test]
    public function leSeuilDeLivraisonSAppliqueApresLeCoupon(): void
    {
        // 2 stylos plume = 49,00 € + 1 carnet = 61,90 € ; −10 % (6,19 €) = 55,71 € : livraison offerte
        // 1 lampe (50,00 €) + 1 crayons (4,50 €) = 54,50 € ; −10 % (5,45 €) = 49,05 € : livraison payante
        $calc = new PriceCalculator();
        $coupon = new Coupon('BIENVENUE10', percentOff: 10);

        $auDessus = new Cart();
        $auDessus->add('STYLO-PLUME', 2);
        $auDessus->add('CARNET-A5');

        $enDessous = new Cart();
        $enDessous->add('LAMPE');
        $enDessous->add('CRAYONS');

        $this->assertSame(5571, $calc->total($auDessus, $coupon));
        $this->assertSame(4905 + 490, $calc->total($enDessous, $coupon));
    }
}

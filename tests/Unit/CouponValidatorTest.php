<?php

declare(strict_types=1);

use MiniShop\CouponValidator;
use MiniShop\InvalidCouponException;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

final class CouponValidatorTest extends TestCase
{
    /** @return array<string, array{string, string, int, bool}> */
    public static function codesAcceptes(): array
    {
        return [
            'BIENVENUE10'               => ['BIENVENUE10',     'BIENVENUE10', 10, false],
            'LIVRAISON'                 => ['LIVRAISON',       'LIVRAISON',   0,  true],
            'minuscules'                => ['bienvenue10',     'BIENVENUE10', 10, false],
            'casse mélangée'            => ['LivRaiSon',       'LIVRAISON',   0,  true],
            'espaces autour'            => [' bienvenue10 ',   'BIENVENUE10', 10, false],
            'tabulation et retour ligne' => ["\tLIVRAISON\n",  'LIVRAISON',   0,  true],
        ];
    }

    #[Test]
    #[DataProvider('codesAcceptes')]
    public function codeValideDonneLeBonCoupon(string $saisie, string $code, int $pourcentage, bool $livraisonOfferte): void
    {
        $coupon = (new CouponValidator())->validate($saisie);

        $this->assertSame($code, $coupon->code);
        $this->assertSame($pourcentage, $coupon->percentOff);
        $this->assertSame($livraisonOfferte, $coupon->freeShipping);
    }

    /** @return array<string, array{string, string}> */
    public static function codesRefuses(): array
    {
        return [
            'expiré'                   => ['NOEL2025',    'Ce code a expiré'],
            'expiré en minuscules'     => [' noel2025 ',  'Ce code a expiré'],
            'inconnu'                  => ['SOLDES50',    'Code promo invalide'],
            'presque bon'              => ['BIENVENUE1',  'Code promo invalide'],
            'espace au milieu'         => ['BIENVENUE 10', 'Code promo invalide'],
            'chaîne vide'              => ['',            'Code promo invalide'],
            'uniquement des espaces'   => ['   ',         'Code promo invalide'],
        ];
    }

    #[Test]
    #[DataProvider('codesRefuses')]
    public function codeRefuseAvecLeBonMessage(string $saisie, string $message): void
    {
        $this->expectException(InvalidCouponException::class);
        $this->expectExceptionMessage($message);

        (new CouponValidator())->validate($saisie);
    }
}

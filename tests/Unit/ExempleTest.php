<?php

declare(strict_types=1);

use MiniShop\Catalog;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

/**
 * Test d'exemple : il montre la forme attendue (Arrange / Act / Assert)
 * et permet de vérifier que PHPUnit est bien installé.
 */
final class ExempleTest extends TestCase
{
    #[Test]
    public function leCarnetCoute12Euros90(): void
    {
        // Arrange : on prépare
        $catalogue = new Catalog();

        // Act : on exécute UNE action
        $carnet = $catalogue->get('CARNET-A5');

        // Assert : on vérifie le résultat
        $this->assertSame(1290, $carnet->price);
    }
}

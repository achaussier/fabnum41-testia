<?php

declare(strict_types=1);

namespace MiniShop\Api;

use RuntimeException;

/** Erreur renvoyée au client de l'API : code HTTP, message lisible, identifiant court. */
final class ApiException extends RuntimeException
{
    public function __construct(
        public readonly int $status,
        public readonly string $errorCode,
        string $message,
    ) {
        parent::__construct($message);
    }
}

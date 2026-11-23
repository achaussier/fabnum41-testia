<?php

declare(strict_types=1);

namespace MiniShop\Api;

/** Commandes de l'API, rangées dans un fichier JSON (créé à la volée). */
final class OrderRepository
{
    public function __construct(private readonly string $file)
    {
    }

    /**
     * @param array<string, mixed> $order
     * @return array<string, mixed> la commande enregistrée, avec son identifiant
     */
    public function add(array $order): array
    {
        $order = ['id' => bin2hex(random_bytes(6))] + $order;

        if (!is_dir(dirname($this->file))) {
            mkdir(dirname($this->file), 0777, true);
        }
        $handle = fopen($this->file, 'c+');
        flock($handle, LOCK_EX);
        $orders = json_decode((string) stream_get_contents($handle), true) ?: [];
        $orders[$order['id']] = $order;
        ftruncate($handle, 0);
        rewind($handle);
        fwrite($handle, json_encode($orders, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
        flock($handle, LOCK_UN);
        fclose($handle);

        return $order;
    }

    /** @return array<string, mixed>|null */
    public function find(string $id): ?array
    {
        if (!is_file($this->file)) {
            return null;
        }
        $handle = fopen($this->file, 'r');
        flock($handle, LOCK_SH);
        $orders = json_decode((string) stream_get_contents($handle), true) ?: [];
        flock($handle, LOCK_UN);
        fclose($handle);

        return $orders[$id] ?? null;
    }
}

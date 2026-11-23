<?php
// API JSON de MiniShop : toutes les adresses qui commencent par /api arrivent ici.
// Le contrat de cette API est décrit dans public/openapi.yaml.

declare(strict_types=1);

use MiniShop\Api\ApiException;
use MiniShop\Api\OrderRepository;
use MiniShop\Api\QuoteService;
use MiniShop\Catalog;
use MiniShop\Product;

require __DIR__ . '/../../vendor/autoload.php';

ini_set('display_errors', '0');
date_default_timezone_set('Europe/Paris');

function respond(int $status, mixed $data, array $headers = []): never
{
    http_response_code($status);
    if ($status === 422) {
        header(($_SERVER['SERVER_PROTOCOL'] ?? 'HTTP/1.1') . ' 422 Unprocessable Content');
    }
    header('Content-Type: application/json; charset=utf-8');
    foreach ($headers as $name => $value) {
        header("$name: $value");
    }
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function productJson(Product $product): array
{
    return [
        'sku'   => QuoteService::sku($product),
        'name'  => $product->name,
        'price' => $product->price,
        'stock' => $product->stock,
    ];
}

/** Le jeton attendu vient de la variable d'environnement MINISHOP_API_TOKEN. */
function requireToken(): void
{
    $expected = getenv('MINISHOP_API_TOKEN') ?: 'minishop-dev-token';
    $received = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!hash_equals('Bearer ' . $expected, $received)) {
        throw new ApiException(401, 'jeton_invalide', 'Jeton d’accès absent ou invalide');
    }
}

/** @return array<mixed> */
function jsonBody(): array
{
    $body = json_decode((string) file_get_contents('php://input'), true);
    if (!is_array($body)) {
        throw new ApiException(422, 'json_invalide', 'Le corps de la requête doit être un objet JSON');
    }
    return $body;
}

try {
    $method   = $_SERVER['REQUEST_METHOD'];
    $path     = rtrim((string) parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
    $segments = array_map('rawurldecode', array_slice(explode('/', $path), 2)); // après /api
    $resource = $segments[0] ?? '';
    $id       = $segments[1] ?? null;

    $catalog = new Catalog();
    $quotes  = new QuoteService($catalog);
    $orders  = new OrderRepository(__DIR__ . '/../../var/orders.json');

    $known = match (true) {
        count($segments) > 2                   => null,
        $resource === 'products'               => ['GET'],
        $resource === 'quote' && $id === null  => ['POST'],
        $resource === 'orders' && $id === null => ['POST'],
        $resource === 'orders'                 => ['GET'],
        default                                => null,
    };
    if ($known === null) {
        throw new ApiException(404, 'route_inconnue', 'Cette adresse n’existe pas dans l’API');
    }
    if (!in_array($method, $known, true)) {
        header('Allow: ' . implode(', ', $known));
        throw new ApiException(405, 'methode_non_autorisee', 'Méthode non autorisée pour cette adresse');
    }

    // GET /api/products et GET /api/products/{sku}
    if ($resource === 'products') {
        if ($id === null) {
            respond(200, array_map(productJson(...), $catalog->all()));
        }
        respond(200, productJson($quotes->find($id)));
    }

    // POST /api/quote
    if ($resource === 'quote') {
        respond(200, $quotes->quote(jsonBody()));
    }

    // POST /api/orders et GET /api/orders/{id} : jeton obligatoire, contrôlé avant tout le reste
    requireToken();

    if ($method === 'GET') {
        $order = $orders->find((string) $id);
        if ($order === null) {
            throw new ApiException(404, 'commande_inconnue', 'Commande inconnue');
        }
        respond(200, $order);
    }

    $body  = jsonBody();
    $name  = trim((string) (is_string($body['customer']['name'] ?? null) ? $body['customer']['name'] : ''));
    $email = trim((string) (is_string($body['customer']['email'] ?? null) ? $body['customer']['email'] : ''));
    if ($name === '') {
        throw new ApiException(422, 'nom_obligatoire', 'Le nom du client est obligatoire');
    }
    if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
        throw new ApiException(422, 'email_invalide', 'L’e-mail du client n’est pas valide');
    }
    try {
        $quote = $quotes->quote($body);
    } catch (ApiException $exception) {
        // Pour une commande, toute erreur sur le panier ou le coupon est un refus des données (422).
        throw new ApiException(422, $exception->errorCode, $exception->getMessage());
    }

    $lines = array_map(
        fn (array $line): array => ['sku' => strtolower($line['sku']), 'qty' => $line['qty']],
        $body['lines'],
    );
    $order = $orders->add([
        'status'     => 'confirmed',
        'total'      => $quote['total'],
        'created_at' => date(DATE_ATOM),
        'customer'   => ['name' => $name, 'email' => $email],
        'lines'      => $lines,
    ]);
    respond(201, $order, ['Location' => '/api/orders/' . $order['id']]);
} catch (ApiException $exception) {
    respond($exception->status, ['error' => $exception->getMessage(), 'code' => $exception->errorCode]);
} catch (Throwable) {
    respond(500, ['error' => 'Erreur interne du serveur', 'code' => 'erreur_interne']);
}

<?php
// Commande : récapitulatif et coordonnées du client.

declare(strict_types=1);

require __DIR__ . '/../templates/init.php';

if ($cart->isEmpty()) {
    redirect('/cart.php');
}

$amounts = summary($cart, $coupon, $calculator);
$name    = '';
$email   = '';
$errors  = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name  = trim((string) ($_POST['name'] ?? ''));
    $email = trim((string) ($_POST['email'] ?? ''));

    if ($name === '') {
        $errors['name'] = 'Le nom est obligatoire';
    }
    if ($email === '') {
        $errors['email'] = 'L’e-mail est obligatoire';
    } elseif (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
        $errors['email'] = 'L’e-mail n’est pas valide';
    }

    if ($errors === []) {
        $_SESSION['order'] = [
            'number' => 'MS-' . random_int(100000, 999999),
            'date'   => date('d/m/Y'),
            'name'   => $name,
            'total'  => $amounts['total'],
        ];
        unset($_SESSION['cart'], $_SESSION['coupon']);
        redirect('/confirmation.php');
    }
}

$title = 'Commande';
require __DIR__ . '/../templates/header.php';
?>
<h1>Votre commande</h1>

<dl class="summary">
    <div>
        <dt>Articles (<?= $cart->count() ?>)</dt>
        <dd><?= euros($amounts['articles']) ?></dd>
    </div>
    <div>
        <dt>Livraison</dt>
        <dd data-testid="order-shipping"><?= $amounts['shipping'] === 0 ? 'Offerte' : euros($amounts['shipping']) ?></dd>
    </div>
    <div class="total">
        <dt>Total à payer</dt>
        <dd data-testid="order-total"><?= euros($amounts['total']) ?></dd>
    </div>
</dl>

<form method="post" action="/checkout.php" class="checkout" novalidate>
    <div class="field">
        <label for="name">Nom</label>
        <input type="text" id="name" name="name" value="<?= e($name) ?>" autocomplete="name"
               <?= isset($errors['name']) ? 'aria-invalid="true" aria-describedby="name-error"' : '' ?>>
        <?php if (isset($errors['name'])): ?>
            <p class="error" id="name-error" role="alert"><?= e($errors['name']) ?></p>
        <?php endif ?>
    </div>
    <div class="field">
        <label for="email">E-mail</label>
        <input type="email" id="email" name="email" value="<?= e($email) ?>" autocomplete="email"
               <?= isset($errors['email']) ? 'aria-invalid="true" aria-describedby="email-error"' : '' ?>>
        <?php if (isset($errors['email'])): ?>
            <p class="error" id="email-error" role="alert"><?= e($errors['email']) ?></p>
        <?php endif ?>
    </div>
    <button type="submit">Commander</button>
</form>
<?php require __DIR__ . '/../templates/footer.php';

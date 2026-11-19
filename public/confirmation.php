<?php
// Confirmation : numéro de commande et montant payé.

declare(strict_types=1);

require __DIR__ . '/../templates/init.php';

$order = $_SESSION['order'] ?? null;
if ($order === null) {
    redirect('/');
}

$title = 'Commande confirmée';
require __DIR__ . '/../templates/header.php';
?>
<h1>Commande confirmée</h1>

<section class="confirmation">
    <p>Merci <?= e($order['name']) ?> ! Votre commande est enregistrée.</p>
    <dl class="summary">
        <div>
            <dt>Numéro de commande</dt>
            <dd data-testid="order-number"><?= e($order['number']) ?></dd>
        </div>
        <div class="total">
            <dt>Montant payé</dt>
            <dd data-testid="order-total"><?= euros($order['total']) ?></dd>
        </div>
    </dl>
    <p><a href="/">Retour au catalogue</a></p>
</section>
<?php require __DIR__ . '/../templates/footer.php';

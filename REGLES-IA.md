# Règles de test du projet MiniShop

## PHPUnit
- PHPUnit 13, attributs PHP (#[Test], #[DataProvider])
- assertSame plutôt qu'assertEquals
- Montants toujours en centimes (int)
- Un test = un comportement, nom en français

## Playwright
- Sélecteurs getByRole / getByLabel / getByTestId
- Jamais de waitForTimeout

## Tests d'API
- Playwright, fixture request : vérifier le code, les en-têtes, puis le corps
- Valeurs attendues calculées depuis SPEC.md, calcul en commentaire
- Jeton lu dans process.env.MINISHOP_API_TOKEN, jamais écrit dans un test
- Données fictives uniquement (e-mails en example.test)

## Toujours
- SPEC.md fait foi, pas le code
- N'utiliser que des méthodes qui existent
- Signaler tout écart code / spec

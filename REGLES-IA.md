# Règles de test du projet MiniShop

## PHPUnit
- PHPUnit 13, attributs PHP (#[Test], #[DataProvider])
- assertSame plutôt qu'assertEquals
- Montants toujours en centimes (int)
- Un test = un comportement, nom en français

## Playwright
- Sélecteurs getByRole / getByLabel / getByTestId
- Jamais de waitForTimeout

## Toujours
- SPEC.md fait foi, pas le code
- N'utiliser que des méthodes qui existent
- Signaler tout écart code / spec

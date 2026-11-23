// Outils des tests de documentation.
// Fichier fourni : on l'utilise dans les tests de tests/doc/, sans avoir à le modifier.
//
// Un test de documentation est un test E2E ordinaire dont chaque étape passe par etape().
// À la fin du test, on obtient dans docs/ :
//   - docs/media/<nom>-<n>.png : une capture par étape
//   - docs/media/<nom>.webm    : la vidéo du parcours
//   - docs/build/<nom>.json    : le « manifeste », la liste des étapes avec captures et instants
// <nom> est le nom du fichier de test sans « .spec.ts » : commande.spec.ts → commande.
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { test, type Page } from '@playwright/test';

// Pause après chaque étape, pour que la vidéo et ses sous-titres soient lisibles.
// (Dans un test ordinaire, on n'attend jamais « à la main » : ici, c'est le rythme du film.)
const PAUSE_MS = 1500;

type Etape = { n: number; titre: string; capture: string; debut: number };
type Guide = { nom: string; depart: number; etapes: Etape[] };

// Le guide en cours de fabrication, pour chaque test (repéré par son identifiant).
const guides = new Map<string, Guide>();

/**
 * Une étape du guide : exécute l'action, puis prend une capture de la page.
 *
 * @param page   la page du test
 * @param titre  ce que fait l'utilisateur, écrit pour être lu : « Ajouter le Carnet A5 au panier »
 * @param action les actions Playwright de cette étape
 */
export async function etape(page: Page, titre: string, action: () => Promise<void>): Promise<void> {
  const info = test.info();
  let guide = guides.get(info.testId);
  if (!guide) {
    // Première étape du test : on démarre le chronomètre et on réserve la vidéo.
    guide = { nom: path.basename(info.file).replace(/\.spec\.ts$/, ''), depart: Date.now(), etapes: [] };
    guides.set(info.testId, guide);
    mkdirSync('docs/media', { recursive: true });
    mkdirSync('docs/build', { recursive: true });
    // La vidéo n'est complète qu'à la fermeture de la page, en fin de test :
    // Playwright attend ce moment pour la copier dans docs/media/.
    page.video()?.saveAs(`docs/media/${guide.nom}.webm`).catch(() => {});
  }
  const { nom, etapes } = guide;
  const n = etapes.length + 1;
  const debut = Math.round((Date.now() - guide.depart) / 100) / 10; // en secondes, 1 décimale
  const capture = `docs/media/${nom}-${n}.png`;

  await test.step(titre, async () => {
    // 1. L'action
    await action();

    // 2. Une capture, rangée dans docs/media/ et jointe au rapport
    const image = await page.screenshot({ path: capture });
    await info.attach(titre, { body: image, contentType: 'image/png' });

    // 3. Le manifeste, réécrit à chaque étape : il est donc complet après la dernière
    etapes.push({ n, titre, capture, debut });
    const manifeste = { titre: info.title, video: `docs/media/${nom}.webm`, etapes };
    writeFileSync(`docs/build/${nom}.json`, JSON.stringify(manifeste, null, 2) + '\n');

    await page.waitForTimeout(PAUSE_MS);
  });
}

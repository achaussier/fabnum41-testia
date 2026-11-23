// Vérifie qu'une réponse de l'API respecte le contrat public/openapi.yaml.
// Fichier fourni : on l'utilise dans les tests, sans avoir à le modifier.
import { readFileSync } from 'node:fs';
import { expect, type APIResponse } from '@playwright/test';
import Ajv2020, { type ErrorObject } from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import { parse } from 'yaml';

// 1. On lit le contrat une fois, et on le confie à ajv (la bibliothèque de validation).
const contrat = parse(readFileSync('public/openapi.yaml', 'utf8'));
const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
ajv.addSchema(contrat, 'contrat'); // les $ref vers components/schemas sont ainsi résolues

// Traduit une erreur d'ajv en une phrase : « /createdAt : champ obligatoire absent ».
function enFrancais(e: ErrorObject): string {
  const ou = e.instancePath || '/';
  switch (e.keyword) {
    case 'required': return `${e.instancePath}/${e.params.missingProperty} : champ obligatoire absent`;
    case 'type': return `${ou} : doit être de type ${e.params.type}`;
    case 'enum': return `${ou} : doit valoir ${e.params.allowedValues.join(' ou ')}`;
    case 'format': return `${ou} : n'est pas au format ${e.params.format}`;
    case 'additionalProperties': return `${e.instancePath}/${e.params.additionalProperty} : champ non documenté`;
    default: return `${ou} : ${e.message}`;
  }
}

/** Échoue si la réponse n'est pas conforme à ce que le contrat promet pour cette route et ce code. */
export async function expectConforme(reponse: APIResponse, methode: string, chemin: string): Promise<void> {
  // 2. Retrouver la route dans le contrat : « /api/orders/abc » correspond à « /api/orders/{id} ».
  const route = Object.keys(contrat.paths).find((modele) =>
    modele === chemin || new RegExp(`^${modele.replace(/\{[^}]+\}/g, '[^/]+')}$`).test(chemin));
  const operation = route && contrat.paths[route][methode.toLowerCase()];
  expect(operation, `${methode} ${chemin} n'existe pas dans le contrat`).toBeTruthy();

  // 3. Le code de la réponse doit être documenté pour cette route.
  const code = String(reponse.status());
  expect(Object.keys(operation.responses), `${methode} ${route} : le code ${code} n'est pas documenté`).toContain(code);

  // 4. Valider le corps JSON avec le schéma prévu pour ce code.
  const schema = operation.responses[code].content?.['application/json']?.schema;
  if (!schema) return; // réponse sans corps documenté : rien d'autre à vérifier
  const pointeur = ['paths', route, methode.toLowerCase(), 'responses', code, 'content', 'application/json', 'schema']
    .map((partie) => partie.replace(/~/g, '~0').replace(/\//g, '~1')).join('/');
  const valider = ajv.compile({ $ref: `contrat#/${pointeur}` });
  const ecarts = valider(await reponse.json()) ? [] : (valider.errors ?? []).map(enFrancais);
  expect(ecarts, `${methode} ${route} (${code}) ne respecte pas le contrat :\n  ${ecarts.join('\n  ')}`).toEqual([]);
}

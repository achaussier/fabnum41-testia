# Décisions

Quand la documentation et l'application ne disent pas la même chose, l'une des deux a tort.
Ce fichier garde la trace de ce qui a été décidé, et pourquoi. Une section par décision.

---

## Décision n° 1 — Date de création d'une commande : `createdAt` ou `created_at` ?

Date : 23/11/2026

### Contexte

Les tests de contrat « POST /api/orders — 201 respecte le contrat » et « GET /api/orders/{id} — 200 respecte le contrat »
échouent avec le message :

```
/createdAt : champ obligatoire absent
```

Le contrat publié (`public/openapi.yaml`, schéma `Order`) et `SPEC.md` (section « API ») annoncent un champ
`createdAt`, obligatoire. L'API renvoie la date dans un champ nommé `created_at`. La valeur est correcte, seul le nom diffère.

### Options

1. **Corriger l'API** : renvoyer `createdAt`, comme le contrat le promet.
2. **Corriger le contrat** : documenter `created_at`, comme l'API le fait aujourd'hui.
3. Renvoyer les deux champs pendant une période de transition.

### Choix

**Option 1 : on corrige l'API.**

- Le contrat est publié : c'est sur lui que comptent ceux qui utilisent l'API. Un client écrit d'après la
  documentation lit `createdAt` et ne trouve rien.
- `SPEC.md` dit la même chose que le contrat : deux sources contre une.
- Tous les autres champs de l'API sont écrits sans tiret bas (`subtotal`, `sku`…) : `created_at` est l'exception.
- Modifier le contrat reviendrait à renommer un champ pour les clients : c'est une rupture, alors que corriger l'API n'en est pas une pour qui suit la documentation.

L'option 3 n'est pas retenue : l'API n'a pas encore de client connu qui dépende de `created_at`, inutile de garder deux champs.

### Conséquences

- Code : dans `public/api/index.php`, enregistrer la date sous la clé `createdAt` (une ligne).
- Données : les commandes déjà enregistrées dans `var/orders.json` gardent l'ancien nom ; fichier de test, on peut le supprimer.
- Tests : les deux tests de contrat repassent au vert, sans les modifier.
- La correction n'est volontairement **pas** faite sur les branches de solution : le test rouge reste visible.

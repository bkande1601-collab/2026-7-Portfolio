# Modèle d'article de blog (checklist)

Chaque article suit la même structure. Copiez `src/content/blog-prompts.ts` comme point de départ, puis ajoutez l'article
dans `src/content/blog.ts` (en premier dans la liste) et son adresse dans `pages` de `src/content/index.ts` (pour le plan du site).

## La structure
1. **Titre (H1)** : la promesse, avec le mot-clé au début si possible (60 à 80 caractères).
2. **`seoTitle`** : la balise title, 45 caractères maximum (le nom du site est ajouté : total ≤ 60).
3. **`description`** : 140 à 155 caractères, une promesse claire et une raison de cliquer.
4. **Introduction** : 2 paragraphes. Le problème du lecteur, puis ce que l'article lui apporte.
5. **`takeaways` (« En bref »)** : 3 ou 4 lignes avec l'essentiel.
6. **Corps** : des H2 qui répondent chacun à une vraie question. Alternez paragraphes courts, listes, `steps` (étapes numérotées)
   et `prompts` (blocs terminal avec bouton Copier) quand l'article donne des modèles.
7. **Un encadré `note`** vers un autre article ou un service (maillage interne : 3 liens internes minimum par article).
8. **`resource`** : une ressource gratuite envoyée par e-mail (livre blanc, checklist).
9. **`faq`** : 4 à 5 questions que les lecteurs se posent vraiment, réponses de 2 à 3 phrases (balisées pour Google).
10. **`sources`** : toute donnée chiffrée a sa source, vérifiée. Sans source, pas de chiffre : on parle de méthode.
11. **Appel à l'action** : `callTitle` et `callText`.

## Les règles
- Un seul sujet par article, un seul mot-clé principal, et son intention de recherche (informer, comparer, acheter).
- Écrire d'abord pour le lecteur : exemples concrets, chiffres réels, pas de remplissage.
- Aucune statistique inventée. Une estimation est présentée comme telle.
- Pas de photo de vous : une couverture typographique suffit (`cover: { tone, cutout: false }`).
- Les deux langues (`fr` et `en`) sont écrites et relues, pas traduites mot à mot.
- Après publication : ajouter l'adresse dans Google Search Console (« Demander une indexation ») et partager l'article.
- Mettre à jour `updated` quand le contenu change : Google valorise les contenus entretenus.

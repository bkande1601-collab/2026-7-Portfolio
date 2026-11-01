# Référencement : ce qui est fait dans le code, et ce qui se fait dans vos comptes

## Déjà dans le site
- Plan du site `/sitemap.xml` (FR et EN, avec versions alternées), `robots.txt` (admin et API exclus).
- Une balise `title` et une `description` uniques par page, URL canoniques, `hreflang` fr / en / x-default.
- Données structurées : Organization, WebSite, ProfessionalService (accueil), Service (pages de services), Product (produits),
  FAQPage (FAQ et articles), BlogPosting et BreadcrumbList (articles), Blog (liste des articles).
- Images de partage (1200 x 630), pages d'erreur et de remerciement en `noindex`.
- La racine `/` redirige côté serveur vers `/fr` (ou `/en` si le navigateur est en anglais).
- Pour valider Google ou Bing par balise : collez le code dans `site.verification` (src/config/site.ts).
- Bing, Yandex et autres : `node scripts/indexnow.mjs` prévient ces moteurs (après chaque déploiement important).

## À faire dans vos comptes (une fois)
1. **Google Search Console** : ajouter le site, valider, envoyer `sitemap.xml`, demander l'indexation des pages clés.
2. **Bing Webmaster Tools** : importer le site depuis Search Console (un clic), puis envoyer le plan du site.
3. **Fiche d'établissement Google** (si vous recevez ou vous déplacez chez des clients) : catégorie, services, site, photos.
4. **Profils** : LinkedIn, GitHub et autres profils pointent vers le site (lien dans la bio). Ajoutez l'adresse LinkedIn
   dans `site.links.linkedin` pour qu'elle apparaisse aussi dans les données structurées.
5. **Liens entrants** : annuaires sérieux, articles invités, partenaires, mentions presse. Quelques bons liens valent mieux que beaucoup de mauvais.

## À entretenir
- Un nouvel article toutes les 2 à 3 semaines, avec la structure de `docs/modele-article-blog.md`.
- Mettre à jour `updated` quand un article change. Demander l'indexation des nouvelles pages dans Search Console.
- Contrôler chaque mois, dans Search Console : Pages (indexation), Performances (requêtes), Ergonomie mobile, Sécurité.

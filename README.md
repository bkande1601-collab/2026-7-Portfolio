# Portfolio — Binta Kande

Site bilingue (FR/EN), rapide et statique, avec de petites fonctions serveur pour la prise de rendez-vous (Google Agenda), les e-mails (Resend) et les formulaires.

**Stack :** [Astro](https://astro.build) · TypeScript · adaptateur Vercel · aucune base de données.

---

## 1. Lancer en local

Prérequis : Node 22.12 ou plus.

```bash
npm install
cp .env.example .env     # facultatif : sans clés, le site marche en « mode aperçu »
npm run dev              # http://localhost:4321
```

Autres commandes : `npm run build` (construit le site) · `npm run preview` (le sert).

**Mode aperçu :** tant que Google Agenda et Resend ne sont pas branchés, le site fonctionne quand même. Les créneaux de réservation sont des exemples (un bandeau le signale), et les formulaires répondent « envoyé » sans rien envoyer.

---

## 2. Où modifier quoi

| Je veux changer… | Fichier |
| --- | --- |
| **Les textes en français** | `src/content/fr.ts` |
| **Les textes en anglais** | `src/content/en.ts` (mêmes clés que le français) |
| **Les prix** | `src/config/site.ts` → `prices` |
| **Les horaires, la durée, les marges, le délai minimum** | `src/config/site.ts` → `booking` |
| **La vidéo de l'accueil** | `src/config/site.ts` → `heroVideo` |
| **La photo (page Parcours)** | `src/config/site.ts` → `photo` |
| **Les liens GitHub / LinkedIn du pied de page** | `src/config/site.ts` → `links` |
| **Les outils de la bande défilante** | `src/content/index.ts` → `tools` |
| **Les couleurs** | `src/styles/global.css` → variables `:root` |

Dans les textes, un mot entouré d'astérisques (`*tournent*`) s'affiche en italique serif coloré.

### Activer la vidéo motion design
1. Déposez le fichier dans `public/video/reel.mp4` (format MP4 ou WebM, idéalement < 8 Mo).
2. Dans `src/config/site.ts`, changez **une seule ligne** :
   ```ts
   heroVideo: '/video/reel.mp4',
   ```
   (Optionnel : `heroVideoPoster: '/video/poster.jpg'`.) Tant que la ligne est vide, un schéma animé tient lieu de vidéo.

### Prix
Dans `src/config/site.ts`, modifiez `amount`. `from: true` affiche « à partir de ». Les prix se mettent à jour sur l'accueil et sur la page Offres, en FR et en EN.

### Horaires de réservation
Dans `booking.hours`, chaque jour (0 = dimanche … 6 = samedi) a une liste de plages `['09:30', '12:30']`. **Un jour avec une liste vide n'affiche aucun créneau.** `durationMin`, `bufferMin` (marge avant/après chaque rendez-vous) et `minNoticeHours` (délai minimum) sont au même endroit.

### Liens masqués
Un lien vide (`''`) dans `links` n'est pas affiché dans le pied de page.

---

## 3. Déployer sur Vercel

1. Poussez ce dépôt sur GitHub (déjà fait).
2. Sur [vercel.com](https://vercel.com) : **Add New → Project**, choisissez le dépôt. Vercel détecte Astro tout seul.
3. **Settings → Environment Variables** : ajoutez les variables de la section suivante (les mêmes que dans `.env.example`).
4. Déployez. Ajoutez votre domaine dans **Settings → Domains**, puis renseignez `SITE_URL` avec cette adresse.

---

## 4. Brancher Resend (e-mails)

1. Créez un compte sur [resend.com](https://resend.com), puis **Domains → Add Domain** et suivez les enregistrements DNS. Attendez « Verified ».
2. **API Keys → Create API Key** (permission « Sending access »).
3. Dans Vercel, ajoutez :
   - `RESEND_API_KEY` : la clé ;
   - `MAIL_FROM` : par exemple `Binta Kande <hello@votre-domaine.com>` (le domaine doit être vérifié) ;
   - `OWNER_EMAIL` : votre adresse, qui reçoit récapitulatifs, messages et inscriptions.

Ce que ça active : e-mail de confirmation personnalisé au visiteur (avec lien Meet, ses réponses, conseils de préparation selon son besoin, dans sa langue), récapitulatif pour vous, accusé de réception des messages, alerte et confirmation pour « Dans le labo ».

---

## 5. Brancher Google Agenda (OAuth)

Le site lit **uniquement** vos plages libres/occupées (jamais le titre ni le contenu de vos événements) et crée l'événement avec un lien Google Meet.

### a) Créer les identifiants
1. Allez sur [console.cloud.google.com](https://console.cloud.google.com) et créez un projet.
2. **APIs & Services → Library** : activez **Google Calendar API**.
3. **OAuth consent screen** : type *External*, renseignez le nom de l'app et votre e-mail. Ajoutez-vous comme **Test user**. (Passez l'app en « In production » pour que le jeton n’expire pas au bout de 7 jours.)
4. **Credentials → Create credentials → OAuth client ID** : type **Web application**. Dans *Authorized redirect URIs*, ajoutez `https://developers.google.com/oauthplayground`.
5. Notez le **Client ID** et le **Client secret**.

### b) Obtenir le refresh token
1. Ouvrez [OAuth Playground](https://developers.google.com/oauthplayground).
2. Roue crantée ⚙ → cochez **Use your own OAuth credentials** et collez Client ID et Client secret.
3. Dans la liste de gauche, saisissez ces deux scopes puis **Authorize APIs** :
   - `https://www.googleapis.com/auth/calendar.events`
   - `https://www.googleapis.com/auth/calendar.freebusy`
4. Connectez-vous avec le compte dont vous voulez utiliser l'agenda, puis **Exchange authorization code for tokens**.
5. Copiez le **Refresh token**.

### c) Variables Vercel
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`
- `GOOGLE_CALENDAR_ID` : `primary` (agenda principal) ou l'identifiant d'un agenda précis.

Redéployez. Le bandeau « mode aperçu » disparaît et les créneaux viennent de votre vrai agenda.

---

## 6. Structure

```
src/
  config/site.ts        prix, horaires, liens, vidéo
  content/fr.ts en.ts   tous les textes
  layouts/Base.astro    gabarit commun (SEO, polices, menu)
  components/           blocs réutilisables
  pages/[lang]/         pages FR et EN (accueil, automatisations, offres, réservation…)
  pages/api/            availability · book · contact · lab (fonctions serveur)
  lib/                  Google Agenda, e-mails, calcul des créneaux
  styles/global.css     design (couleurs, typographie, composants)
```

## 7. Sécurité

- Aucun secret dans le code : tout passe par des variables d'environnement. `.env` est ignoré par Git.
- Les formulaires ont un champ piège anti-robot, une validation côté serveur et un échappement HTML dans les e-mails.
- Un créneau n'est réservé que s'il fait partie de ce que le serveur propose réellement à cet instant (horaires, marges, délai, pas déjà pris).
- Pour limiter davantage le spam en production, activez le **Vercel Firewall / Attack Challenge Mode** si besoin.

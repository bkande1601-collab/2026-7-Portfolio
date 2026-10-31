# Agents IA (n8n)

| Fichier | Rôle |
|---|---|
| `diagnostic-prompt.md` | Prompt de l'agent « Diagnostic » |
| `master-prompt-prompt.md` | Prompt de l'agent « Master prompt » |
| `build.py` | Génère les deux workflows à partir des prompts et du code des nœuds |
| `diagnostic.workflow.json`, `prompt.workflow.json` | Workflows générés (à ne pas éditer à la main) |

Flux : le site appelle `https://VOTRE-N8N/webhook/diagnostic` ou `/webhook/prompt` après le questionnaire (variables `N8N_WEBHOOK_URL` et `N8N_WEBHOOK_SECRET`). Le workflow valide les données, ignore les doublons, appelle Gemini, contrôle la qualité et envoie le résultat par e-mail à `OWNER_EMAIL` pour relecture. En cas d'échec (données invalides, erreur ou blocage du modèle), une alerte avec les réponses du client est envoyée.

Modifier un prompt : éditer le `.md`, lancer `python3 docs/n8n/build.py`, puis `node scripts/n8n-update.mjs`.
Première installation : `node scripts/n8n-setup.mjs`.

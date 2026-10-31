# Agent IA « Diagnostic » (n8n)

- `diagnostic.workflow.json` : workflow à importer dans n8n (Webhook, Gemini Flash-Lite, e-mail Resend).
- `diagnostic-prompt.md` : le prompt de l'agent, déjà intégré au workflow (nœud « Préparer la requête »). Modifiez-le dans n8n, puis copiez-le ici pour garder une trace.

Le site appelle le webhook après le questionnaire (variables `N8N_WEBHOOK_URL` et `N8N_WEBHOOK_SECRET`). Le diagnostic est envoyé à l'adresse `OWNER_EMAIL` du nœud « Préparer la requête », pour relecture avant envoi au client.

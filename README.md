# IArretada

Fonte do site Cloudflare Pages `iarretada`. Os arquivos publicados estão em `public/`, e o endpoint de contato está em `functions/api/lead.js`.

- Preview: `wrangler pages deploy public --project-name iarretada --branch preview-finalizacao-20261106`
- Produção: `wrangler pages deploy public --project-name iarretada --branch main` (somente após validar o preview).
- D1 e Workers AI: os bindings `DB` e `AI` de preview e produção estão em `wrangler.toml`. O preview usa a base `iarretada-preview-db`; produção usa `iarretada-db`.
- Antes da primeira publicação do chat em produção, aplicar `migrations/002_chat_limits.sql` à base `iarretada-db`.

O projeto Pages usa upload direto; o merge Git não publica o domínio automaticamente.

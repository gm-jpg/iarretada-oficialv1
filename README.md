# IArretada

Fonte do site Cloudflare Pages `iarretada`. Os arquivos publicados estão em `public/`, e o endpoint de contato está em `functions/api/lead.js`.

- Preview: `wrangler pages deploy public --project-name iarretada --branch preview-finalizacao-20261106`
- Produção: `wrangler pages deploy public --project-name iarretada --branch main` (somente após validar o preview).
- D1: os bindings `DB` de preview e produção estão em `wrangler.toml`; nunca usar dados reais no preview.

O projeto Pages usa upload direto; o merge Git não publica o domínio automaticamente.

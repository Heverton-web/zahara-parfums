# WhatsApp Integration Module

**Files**: `src/lib/whatsapp.js`, `src/components/product/WhatsAppModal.jsx`
**Criticality**: LOW_CRITICALITY — Customer communication

## Description
Constructs WhatsApp `wa.me` deep links with pre-filled messages containing product details and user name. No server-side component — purely client-side URL construction.

## Security Constraints
- User name is embedded in URL without sanitization (potential URL injection)
- WhatsApp number is hardcoded in source (`5519981868198`)
- Message template interpolates `produto.nome`, `produto.marcas?.nome`, `produto.preco` directly
- No input length validation on user name

## Linked Vulnerabilities
- [CWE-79](../vulnerabilities/CWE-79.md) — Cross-site scripting (if name rendered unsafely)

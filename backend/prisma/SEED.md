# Backup e Restauração do Banco

## Capturar snapshot

```bash
npm run db:snapshot
```

Conecta no banco, lê todas as tabelas e salva o estado atual em `prisma/seed-data.json`.

## Restaurar snapshot

```bash
npm run db:restore
```

> **⚠️ Atenção:** este comando **apaga todos os dados atuais** do banco antes de restaurar o snapshot. A operação é atômica — se qualquer inserção falhar, nenhuma alteração é persistida (rollback completo).

## Observações

- `seed-data.json` está no `.gitignore` por conter dados sensíveis (emails, senhas, dados de pagamento Stripe).
- Guarde o arquivo em local seguro se precisar de backup duradouro.
- Timestamps originais (`createdAt`, `updatedAt`) são preservados na restauração.

# Context do Projeto

## Arquitetura Geral

Sistema de gerenciamento de pedidos para restaurante (pizzaria/lanchonete), seguindo uma arquitetura **monolito modular backend-first**. O backend utiliza o padrão **Controller → Service → Prisma ORM**, com middleware pipeline para autenticacao, autorizacao, validacao e tratamento de erros.

```
Cliente (HTTP) → Express Server
  → Helmet / CORS / Rate Limit / Compression
  → Morgan (logging)
  → Router (/api)
    → validateSchema (Zod)
    → isAuthenticated (JWT)
    → isAdmin (role check)
    → Controller → Service → Prisma → PostgreSQL (Neon)
  → errorHandler (global)
```

---

## Stack Utilizada

| Camada         | Tecnologia                          |
| -------------- | ----------------------------------- |
| Runtime        | Node.js + TypeScript 6.0.2 (strict) |
| Framework      | Express.js 5.2.1                    |
| ORM            | Prisma 7.6.0                        |
| Banco de Dados | PostgreSQL (Neon, sa-east-1)        |
| Autenticacao   | jsonwebtoken 9.0.3 + bcryptjs 3.0.3 |
| Validacao      | Zod 4.3.6                           |
| Seguranca      | helmet 8.1.0, cors 2.8.6, express-rate-limit 8.3.2 |
| Upload         | multer 2.1.1 (instalado, nao conectado) |
| Imagens        | cloudinary 2.9.0 (instalado, nao conectado) |
| Compressao     | compression 1.8.1                   |
| Logging        | morgan 1.10.1                       |
| Dev tools      | tsx 4.21.0 (watch mode)             |

**Scripts (package.json):**
- `npm run dev` — tsx watch ./src/server.ts
- `npm run build` — tsc
- `npm start` — node dist/server.js

---

## Estrutura de Pastas

```
teste/
├── context.md                          ← este arquivo
└── backend/
    ├── prisma/
    │   ├── migrations/
    │   │   └── 20260404181545_init/    (migration inicial com todas as tabelas)
    │   └── schema.prisma               (schema do banco)
    ├── src/
    │   ├── @types/
    │   │   └── express/
    │   │       └── index.d.ts          (extensao do Request: userId, userRole)
    │   ├── config/
    │   │   └── env.ts                  (validacao de env vars com Zod)
    │   ├── controllers/
    │   │   └── user/
    │   │       └── AuthUserController.ts
    │   ├── errors/
    │   │   └── AppError.ts             (classe customizada de erros)
    │   ├── generated/
    │   │   └── prisma/                 (tipos auto-gerados pelo Prisma)
    │   ├── lib/
    │   │   └── prisma.ts               (singleton do PrismaClient)
    │   ├── middlewares/
    │   │   ├── asyncHandler.ts         (wrapper try/catch para async handlers)
    │   │   ├── errorHandler.ts         (handler global de erros)
    │   │   ├── isAdmin.ts              (verifica role === ADMIN)
    │   │   ├── isAuthenticated.ts      (verifica JWT Bearer token)
    │   │   └── validateSchema.ts       (validacao Zod para body/params/query)
    │   ├── routes/
    │   │   ├── index.ts                (agregador de rotas)
    │   │   └── user.routes.ts          (rotas de usuario)
    │   ├── schemas/
    │   │   └── userSchema.ts           (schemas Zod de validacao)
    │   ├── services/
    │   │   └── user/
    │   │       └── AuthUserService.ts  (logica de login)
    │   ├── utils/                      (vazio)
    │   └── server.ts                   (entry point do Express)
    ├── .env
    ├── .gitignore
    ├── package.json
    ├── prisma.config.ts
    └── tsconfig.json
```

---

## Models / Schemas do Prisma

### Enum

```prisma
enum Role {
  STAFF
  ADMIN
}
```

### User
| Campo     | Tipo     | Detalhes                    |
| --------- | -------- | --------------------------- |
| id        | String   | UUID, PK                    |
| name      | String   |                             |
| email     | String   | unique                      |
| password  | String   |                             |
| role      | Role     | default: STAFF              |
| createdAt | DateTime | auto                        |
| updatedAt | DateTime | auto                        |

### Category
| Campo     | Tipo     | Detalhes                    |
| --------- | -------- | --------------------------- |
| id        | String   | UUID, PK                    |
| name      | String   |                             |
| disabled  | Boolean  |                             |
| products  | Product[]| relacao 1:N                 |
| createdAt | DateTime | auto                        |
| updatedAt | DateTime | auto                        |

### Product
| Campo       | Tipo     | Detalhes                  |
| ----------- | -------- | ------------------------- |
| id          | String   | UUID, PK                  |
| name        | String   |                           |
| price       | Int      |                           |
| description | String   |                           |
| banner      | String   | URL da imagem             |
| disabled    | Boolean  | soft delete               |
| category_id | String   | FK → Category (CASCADE)   |
| items       | Item[]   | relacao 1:N               |
| createdAt   | DateTime | auto                      |
| updatedAt   | DateTime | auto                      |

### Order
| Campo     | Tipo     | Detalhes                    |
| --------- | -------- | --------------------------- |
| id        | String   | UUID, PK                    |
| table     | Int      | numero da mesa              |
| status    | Boolean  |                             |
| draft     | Boolean  |                             |
| name      | String?  | opcional (nome/obs)         |
| items     | Item[]   | relacao 1:N                 |
| createdAt | DateTime | auto                        |
| updatedAt | DateTime | auto                        |

### Item
| Campo      | Tipo     | Detalhes                   |
| ---------- | -------- | -------------------------- |
| id         | String   | UUID, PK                   |
| amount     | Int      | quantidade                 |
| order_id   | String   | FK → Order (CASCADE)       |
| product_id | String   | FK → Product (CASCADE)     |
| createdAt  | DateTime | auto                       |
| updatedAt  | DateTime | auto                       |

**Relacionamentos:**
- Category 1 → N Product
- Product 1 → N Item
- Order 1 → N Item

---

## Rotas da API

**Base URL:** `http://localhost:3333`

### Implementadas

| Metodo | Rota               | Middleware                | Controller              | Descricao          |
| ------ | ------------------ | ------------------------ | ----------------------- | ------------------ |
| GET    | /health            | —                        | inline                  | Health check       |
| POST   | /api/users/session | validateSchema, asyncHandler | AuthUserController.handle | Login (JWT)        |

### Fluxo de Autenticacao

1. `POST /api/users/session` com `{ email, password }`
2. Servico busca usuario por email, compara senha com bcrypt
3. Retorna `{ token, user: { id, name, email, role } }`
4. Token JWT expira em 24h, payload: `{ sub: userId, role }`
5. Rotas protegidas usam `isAuthenticated` → extrai Bearer token → seta `req.userId` e `req.userRole`
6. Rotas admin usam `isAdmin` → verifica `req.userRole === 'ADMIN'`

---

## Paginas do Frontend

**Nenhuma implementada.** O projeto e backend-only no momento. O CORS esta configurado para `http://localhost:3000` (env `FRONTEND_URL`), indicando que um frontend React/Next.js e planejado.

---

## Padroes de Design Adotados

1. **Service Layer** — logica de negocio isolada em services (ex: `AuthUserService`), controllers apenas orquestram request/response
2. **Controller Pattern** — cada endpoint tem um controller dedicado com metodo `handle()`
3. **Middleware Pipeline** — validacao → autenticacao → autorizacao → handler → error handler
4. **Custom Error Class** — `AppError` com `statusCode` e `message` para erros controlados
5. **Global Error Handler** — trata AppError, erros do Prisma (P2002 duplicado, P2025 nao encontrado) e erros genericos
6. **Schema Validation** — Zod schemas centralizados em `/schemas`, middleware `validateSchema` valida body/params/query
7. **Environment Validation** — variaveis de ambiente validadas com Zod no boot (falha rapido se config invalida)
8. **Async Handler Wrapper** — `asyncHandler` evita try/catch repetitivo nos controllers
9. **Singleton Pattern** — instancia unica do PrismaClient em `lib/prisma.ts`
10. **Soft Delete** — campo `disabled` em Product e Category (nao deleta do banco)

---

## O que Falta Implementar

### Alta Prioridade (Core do Sistema)

- [ ] **Signup de usuario** — `POST /api/users` (criar conta)
- [ ] **CRUD de categorias** — criar, listar, editar, desabilitar
- [ ] **CRUD de produtos** — criar, listar, editar, desabilitar (com upload de imagem)
- [ ] **CRUD de pedidos** — abrir, listar, fechar, enviar (draft → ativo → finalizado)
- [ ] **CRUD de itens** — adicionar/remover itens de um pedido
- [ ] **Upload de imagens** — conectar multer + cloudinary (ja instalados, nao configurados)
- [ ] **Listar/detalhar usuario** — `GET /api/users/me`, `GET /api/users` (admin)

### Media Prioridade

- [ ] **Frontend** — interface web (React/Next.js) para garcom e cozinha
- [ ] **Seed do banco** — dados iniciais (usuario admin, categorias, produtos de exemplo)
- [ ] **Refresh token** — renovacao de JWT sem relogin
- [ ] **Testes unitarios** — services e middlewares
- [ ] **Testes de integracao** — rotas end-to-end
- [ ] **Documentacao da API** — Swagger/OpenAPI

### Baixa Prioridade

- [ ] **Docker** — Dockerfile + docker-compose para dev e producao
- [ ] **CI/CD** — GitHub Actions (lint, test, build, deploy)
- [ ] **Rate limiting por rota** — limites diferentes para login vs listagem
- [ ] **Logs estruturados** — substituir morgan por winston/pino com JSON
- [ ] **Monitoramento** — health check detalhado (DB status, uptime)
- [ ] **Repository Pattern** — abstrair acesso ao Prisma dos services (opcional)

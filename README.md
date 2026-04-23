# 🌿 Pétrica

E-commerce de floricultura com painel administrativo completo, carrinho, checkout com pagamento via Stripe e autenticação por e-mail e Google.

🔗 Ver ao vivo: [link]

---

## 📖 Sobre o projeto

Pétrica é um projeto de portfólio de e-commerce full-stack para uma floricultura botânica editorial. O objetivo foi construir uma aplicação completa — da modelagem do banco até o frontend — com foco em boas práticas de arquitetura, design system consistente e integrações reais com serviços externos (Stripe, Cloudinary, Google OAuth).

---

## 🖼 Demo

<!-- adicionar aqui: screenshot ou GIF da aplicação -->

---

## ✅ Funcionalidades

### Loja
- Listagem de produtos com paginação
- Página de detalhe do produto com carrossel de imagens
- Filtro por categoria
- Carrinho persistido por usuário (adicionar, atualizar quantidade, remover, limpar)
- Checkout em múltiplos passos (endereço → detalhes → pagamento)
- Integração com Stripe (Payment Intents + Webhooks)
- Página de confirmação de pedido

### Autenticação
- Cadastro e login por e-mail/senha (JWT)
- Login com Google OAuth
- Rehidratação de sessão via `localStorage`
- Guard de rota com redirecionamento após login

### Conta do usuário
- Gerenciamento de endereços (CRUD, endereço padrão)
- Histórico de pedidos

### Painel Administrativo
- Dashboard com visão geral
- Gerenciamento de produtos (criar, editar, desativar, imagens via Cloudinary)
- Gerenciamento de categorias (criar, editar, desativar)
- Gerenciamento de pedidos (tabela desktop / cards mobile, atualização de status)

---

## 🛠 Stack

### Backend
| Tecnologia | Versão |
|---|---|
| Node.js + Express | Express 5.2.1 |
| TypeScript | 6.0.2 |
| Prisma ORM + adapter pg | 7.6.0 |
| Zod (validação) | 4.3.6 |
| JWT (jsonwebtoken) | 9.0.3 |
| Multer + Cloudinary | 2.1.1 / 2.9.0 |
| Stripe | 18.5.0 |
| Helmet, CORS, morgan | — |
| express-rate-limit | 8.3.2 |

### Frontend
| Tecnologia | Versão |
|---|---|
| Next.js App Router | 16.2.3 |
| React | 19.2.4 |
| TypeScript | 5.x |
| Tailwind CSS v4 | 4.x |
| Zod (validação de forms) | 4.3.6 |
| Stripe.js | — |
| lucide-react | 1.8.0 |
| sonner (toasts) | 2.0.7 |

### Banco de Dados
- PostgreSQL (via Prisma + `@prisma/adapter-pg`)

### Serviços Externos
- **Cloudinary** — armazenamento e otimização de imagens
- **Stripe** — processamento de pagamentos (Payment Intents + Webhooks)
- **Google OAuth** — autenticação social

---

## 🏗 Arquitetura

O projeto é um monorepo com dois workspaces independentes: `backend/` e `frontend/`.

### Backend (`backend/src/`)

Segue uma arquitetura em camadas por domínio:

```
src/
├── config/        # Configuração de env, Prisma, Cloudinary, Stripe, Multer
├── controllers/   # Recebem a request e delegam ao service
├── services/      # Regras de negócio
├── schemas/       # Validação com Zod (body, params, query)
├── middlewares/   # asyncHandler, errorHandler, isAuthenticated, isAdmin, validateSchema
├── routes/        # Registro de rotas por domínio + webhooks separados
├── errors/        # AppError (erros conhecidos com statusCode)
└── generated/     # Prisma Client gerado
```

**Pipeline de uma requisição:**
```
Request → isAuthenticated? → isAdmin? → validateSchema → asyncHandler(controller) → service → Prisma
                                                                                          ↓ erro
                                                                                    AppError → errorHandler → JSON
```

### Frontend (`frontend/src/`)

Next.js App Router com componentes por domínio:

```
src/
├── app/           # Páginas e layouts (App Router)
├── components/    # Componentes por domínio (admin, cart, checkout, shop, etc.)
├── contexts/      # AuthContext e CartContext
├── hooks/         # useScrollAnimation
├── lib/           # api.ts, utils.ts, formatCurrency.ts, stripe.ts
└── types/         # Interfaces TypeScript por domínio
```

### Domínios implementados
`user` · `category` · `product` · `productImage` · `cart` · `order` · `address` · `upload` · `webhook` · `payment`

---

## 🚀 Como rodar localmente

### Pré-requisitos

- Node.js ≥ 20
- PostgreSQL rodando localmente (ou connection string de um serviço gerenciado)
- Conta no [Cloudinary](https://cloudinary.com) (free tier funciona)
- Conta no [Stripe](https://stripe.com) (modo teste)
- Projeto no [Google Cloud Console](https://console.cloud.google.com) com OAuth 2.0 configurado

### 1. Clone o repositório

```bash
git clone https://github.com/Felipe-Yasuo/petrica.git
cd petrica
```

### 2. Configure e inicie o backend

```bash
cd backend
cp .env.example .env
```

Preencha o `.env` com os valores reais (veja a seção de variáveis abaixo).

```bash
npm install
npx prisma migrate dev     # cria as tabelas no banco
npm run dev                # inicia em modo watch na porta 3333
```

### 3. Configure e inicie o frontend

Em outro terminal:

```bash
cd frontend
```

Crie o arquivo `.env.local`:

```bash
cp .env.local.example .env.local   # se existir
# ou crie manualmente com as variáveis abaixo
```

```bash
npm install
npm run dev    # inicia na porta 3000
```

### 4. (Opcional) Webhooks do Stripe em desenvolvimento

Para testar o fluxo de pagamento localmente, instale o [Stripe CLI](https://stripe.com/docs/stripe-cli) e execute:

```bash
stripe listen --forward-to localhost:3333/api/webhooks/stripe
```

O CLI vai imprimir o `STRIPE_WEBHOOK_SECRET` — use esse valor no `.env` do backend.

---

## 🔑 Variáveis de Ambiente

### Backend (`backend/.env`)

```env
# Banco de dados
DATABASE_URL=""                              # Connection string do PostgreSQL

# Autenticação
JWT_SECRET=""                               # Mínimo 32 caracteres

# Servidor
PORT=3333
FRONTEND_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Stripe
STRIPE_SECRET_KEY=""                        # Começa com sk_test_ (testes) ou sk_live_
STRIPE_WEBHOOK_SECRET=""                    # Começa com whsec_ — gerado pelo Stripe CLI ou dashboard
STRIPE_PAYMENT_INTENT_EXPIRATION_MINUTES=30

# Cron jobs
CRON_SECRET=""                              # Mínimo 32 caracteres — usado para autenticar chamadas agendadas

# Google OAuth
GOOGLE_CLIENT_ID=""
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL="http://localhost:3333/api"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""       # Começa com pk_test_ ou pk_live_
NEXT_PUBLIC_GOOGLE_CLIENT_ID=""
```

---

## 📜 Scripts disponíveis

### Backend

```bash
npm run dev      # Inicia o servidor em modo watch com tsx (recarrega em alterações)
npm run build    # Gera o Prisma Client e compila TypeScript para dist/
npm start        # Executa o servidor compilado (produção)
```

### Frontend

```bash
npm run dev      # Inicia o servidor Next.js em modo desenvolvimento
npm run build    # Build otimizado para produção
npm start        # Serve o build de produção
npm run lint     # Executa o ESLint
```

---

## 🗺 Roadmap

- [ ] Recuperação de senha por e-mail
- [ ] Edição de perfil (nome, telefone, senha)
- [ ] Dashboard admin com métricas reais (receita, pedidos por status, etc.)
- [ ] Notificações de status de pedido por e-mail
- [ ] Testes automatizados (unitários e de integração)
- [ ] Página de detalhes do pedido para o cliente

---

## Licença

Este é um projeto de portfólio, sem licença de uso definida.

# Sistema de Gestão de Oficina Mecânica

Sistema para gerenciar uma oficina mecânica: agendamento de serviços, controle de estoque, gastos e faturamento. Atualmente em desenvolvimento, uso restrito ao proprietário/equipe interna, com arquitetura preparada para futuramente liberar acesso a clientes.

## Stack Tecnológica

- **Front-end + Back-end:** Next.js + React + TypeScript (App Router)
- **Banco de dados:** PostgreSQL (rodando localmente via Docker em desenvolvimento)
- **ORM:** Prisma (v6)
- **Autenticação:** Auth.js v5 (Credentials — e-mail/senha, sem login social)
- **Estilização:** Tailwind CSS
- **Validação:** Zod

## Pré-requisitos

- Node.js (versão LTS)
- Docker Desktop
- Git

## Como rodar o projeto localmente

1. Clone o repositório e instale as dependências:

git clone <url-do-repositorio>
cd oficina-mecanica-sistema
npm install


2. Suba o banco de dados local via Docker:

docker compose up -d


3. Configure o arquivo `.env` na raiz do projeto com:

DATABASE_URL="postgresql://oficina_user:oficina_senha_local@localhost:5432/oficina_db"
AUTH_SECRET="sua-string-secreta-aqui"


4. Gere o Prisma Client e aplique as migrations:

npx prisma generate
npx prisma migrate dev


5. Rode o projeto:

npm run dev

   Acesse em `http://localhost:3000`.

## Estrutura de Pastas

src/
├── app/ → Páginas e rotas (App Router)
│ ├── api/ → Rotas de API (backend)
│ ├── login/ → Página de login (pública)
│ └── (dashboard)/ → Rotas autenticadas (clientes, veículos, OS, agenda, estoque, financeiro)
├── components/
│ ├── ui/ → Componentes genéricos reutilizáveis
│ └── forms/ → Formulários específicos de negócio
├── lib/ → Configurações centrais (prisma.ts, auth.ts)
├── services/ → Regras de negócio e acesso a dados, por entidade
├── validations/ → Schemas de validação (Zod), por entidade
└── types/ → Tipos TypeScript compartilhados


**Convenção:** nomes de entidades de negócio em português (ex: `cliente.service.ts`), nomes de pastas/conceitos técnicos em inglês (ex: `components`, `services`).

## Comandos Úteis

| Comando | O que faz |
|---|---|
| `npm run dev` | Roda o projeto em modo desenvolvimento |
| `docker compose up -d` | Sobe o banco de dados local |
| `docker compose down` | Desliga o banco (mantém os dados) |
| `npx prisma studio` | Interface visual para ver/editar dados do banco |
| `npx prisma migrate dev --name nome` | Cria uma nova migration após alterar o schema |
| `npx prisma generate` | Regenera os tipos do Prisma Client |

## Roadmap

- [x] **Fase 0 — Fundação:** setup do projeto, banco, autenticação
- [ ] **Fase 1 — MVP Operacional:** cadastro de clientes/veículos, ordens de serviço, agenda, estoque
- [ ] **Fase 2 — Financeiro:** gastos, faturamento, relatórios
- [ ] **Fase 3 — Gestão Avançada:** KPIs, múltiplos funcionários, alertas de estoque
- [ ] **Fase 4 — Portal do Cliente:** login e acompanhamento pelo cliente

## Status do Projeto

Em desenvolvimento — uso apenas local/teste, ainda não implantado em produção.
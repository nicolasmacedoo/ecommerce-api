# E-commerce API

Uma API completa para gerenciamento de e-commerce construída com NestJS, TypeScript e Prisma, seguindo princípios de Domain-Driven Design (DDD) e Clean Architecture.

## 📋 Índice

- [Recursos](#recursos)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Rodando a Aplicação](#rodando-a-aplicação)
- [Testes](#testes)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Endpoints da API](#endpoints-da-api)
- [Docker](#docker)

## Recursos

- ✅ Autenticação e autorização com JWT
- ✅ Sistema de controle de acesso baseado em papéis (RBAC)
- ✅ Gestão de produtos
- ✅ Gestão de pedidos
- ✅ Gestão de clientes
- ✅ Geração de relatórios de vendas
- ✅ Processamento de pagamentos (simulado)
- ✅ Documentação com Swagger
- ✅ Testes automatizados

## Tecnologias Utilizadas

- **Backend**: NestJS, TypeScript
- **Banco de Dados**: PostgreSQL
- **ORM**: Prisma
- **Autenticação**: JWT (JSON Web Tokens)
- **Validação**: Zod
- **Documentação**: Swagger / OpenAPI
- **Testes**: Vitest
- **Containerização**: Docker
- **Formatação de Código**: Biome

## Pré-requisitos

- Node.js (versão 20 ou superior)
- npm (ou yarn/pnpm)
- PostgreSQL
- Docker (opcional)

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/nicolasmacedoo/ecommerce-api.git
   cd ecommerce-api
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Gere os artefatos do Prisma:
   ```bash
   npx prisma generate
   ```

## Configuração

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Atualize o arquivo `.env` com suas configurações:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce?schema=public"
   JWT_SECRET="seu-segredo-jwt"
   PORT=3333
   ```

3. Rode as migrações do banco de dados:
   ```bash
   npx prisma migrate dev
   ```

4. Popule o banco de dados com dados iniciais:
   ```bash
   npx prisma db seed
   ```

## Simulação de E-mail

Ao criar um novo usuário na aplicação, o sistema simula o envio de um e-mail de confirmação. O link de confirmação é exibido no terminal, permitindo testar facilmente o fluxo de registro sem precisar configurar um serviço de e-mail real.

Exemplo de saída no terminal:

[Email Service] Confirmation email sent: https://ethereal.email/message/Z9NnyYsobaIEI0j8Z9Nn2W-dLJ5jguSbAAAAAUlSxxQylUr9-bpKq0ytsps

## Rodando a Aplicação

### Desenvolvimento

```bash
npm run start:dev
```

### Produção

```bash
npm run build
npm run start:prod
```

A API estará disponível em: `http://localhost:3333`  
Documentação Swagger: `http://localhost:3333/api`

## Testes

### Executando Testes Unitários

```bash
npm test
```

### Executando Testes com Cobertura

```bash
npm run test:cov
```

### Testes em Modo Watch

```bash
npm run test:watch
```

## Estrutura do Projeto

O projeto segue uma arquitetura limpa:

src/ ├── core/ # Core do domínio (entidades base, erros, etc.) ├── domain/ # Lógica de domínio │ └── ecommerce/ # Contexto de e-commerce │ ├── application/ # Casos de uso e interfaces de repositório │ └── enterprise/ # Entidades e regras de negócio ├── infra/ # Implementações externas │ ├── auth/ # Autenticação e autorização │ ├── database/ # Implementações do banco de dados │ ├── http/ # Controladores e configurações HTTP │ └── storage/ # Serviços de armazenamento


### Principais Diretórios

#### `/core`
Contém componentes fundamentais que dão suporte ao restante da aplicação, como:
- Definições de entidades base
- Utilitários de tratamento de erros
- Gerenciamento de eventos
- Classes abstratas reutilizáveis

#### `/domain/ecommerce`
O coração do sistema, organizado seguindo os princípios de DDD:

- **enterprise**: Contém as entidades de negócio como `User`, `Product`, `Customer`, `Order` e suas regras invariantes.
- **application**: Contém casos de uso (use cases) que orquestram as entidades para realizar operações de negócio e interfaces dos repositórios.

#### `/infra`
Implementações concretas de interfaces definidas no domínio:

- **auth**: Autenticação JWT, guardas e decoradores para autorização
- **database**: Repositórios concretos usando Prisma
- **http**: Controladores, pipes de validação e DTOs
- **storage**: Implementações para armazenamento de arquivos

## Endpoints da API

A API está documentada usando Swagger. Após iniciar a aplicação, acesse:

`http://localhost:3333/api` para visualizar a documentação interativa.


### Principais Endpoints

#### Autenticação
- `POST /auth`: Autenticar usuário e obter token JWT

#### Produtos
- `GET /products`: Listar produtos com paginação e filtros
- `GET /products/:id`: Obter detalhes de um produto específico
- `POST /products`: Criar um novo produto
- `PUT /products/:id`: Atualizar um produto existente
- `DELETE /products/:id`: Excluir um produto

#### Clientes
- `GET /customers`: Listar clientes com paginação e filtros
- `GET /customers/:id`: Obter detalhes de um cliente específico
- `POST /customers`: Criar um novo cliente
- `PUT /customers/:id`: Atualizar um cliente existente
- `DELETE /customers/:id`: Excluir um cliente

#### Pedidos
- `GET /orders`: Listar pedidos recentes com paginação
- `POST /orders`: Criar um novo pedido
- `PUT /orders/:id`: Atualizar um pedido existente

#### Relatórios
- `POST /reports/sales`: Gerar relatório de vendas por período
- `GET /reports/sales`: Listar relatórios gerados anteriormente

## Padrões de Projeto Utilizados

### Padrões Arquiteturais
- **Clean Architecture**: Separação clara entre domínio, aplicação e infraestrutura
- **Domain-Driven Design (DDD)**: Foco nas regras de negócio e domínio
- **Repository Pattern**: Abstração da camada de persistência
- **Factory Pattern**: Criação de objetos complexos
- **Dependency Injection**: Gerenciado pelo framework NestJS

### Padrões de Design
- **Value Objects**: Para encapsular conceitos como `CustomerWithEmail`, `OrderWithCustomer`
- **Aggregate Roots**: Entidades principais como `Order` e `Product`
- **Domain Events**: Para comunicação entre diferentes partes do sistema
- **Use Case Pattern**: Classes específicas para cada caso de uso da aplicação

## Docker

A aplicação pode ser executada facilmente usando Docker.

### Usando Docker Compose

O arquivo `docker-compose.yml` configura tanto a aplicação quanto um banco PostgreSQL:

```bash
docker-compose up -d
```

### Construindo a imagem manualmente

```bash
docker build -t ecommerce-api .
```
### Executando a imagem

```bash
docker run -p 3333:3333 -e DATABASE_URL="postgresql://user:password@db:5432/ecommerce" -e JWT_SECRET="seu-segredo" ecommerce-api
```
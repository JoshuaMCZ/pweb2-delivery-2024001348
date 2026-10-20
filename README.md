# Delivery Tracker API

Projeto das Atividades 05, 06 e 07 de Programação Web II.

A aplicação é uma API para cadastro e acompanhamento de entregas, feita com Node.js, Express, Prisma e SQLite. O projeto utiliza arquitetura em camadas, separando as rotas, controllers, services e repositories.

## Como executar

É necessário ter o Node.js e o npm instalados.

Na pasta do projeto, execute:

```bash
npm install
```

Crie o arquivo `.env` a partir do exemplo. No terminal, execute:

```cmd
cp .env.example .env # DATABASE_URL="file:./dev.db" 
```

Confira se o `.env` contém:

```env
DATABASE_URL="file:./dev.db"
```

Aplique as migrações do Prisma para criar o banco:

```bash
npx prisma migrate dev
```

Depois:

```bash
npm start
```

A API ficará disponível em:

```text
http://localhost:3000
```

Para inspecionar os dados do banco, execute em outro terminal:

```bash
npx prisma studio
```

## Testando a API

### Verificar se está funcionando

```bash
curl http://localhost:3000/api/health
```

Resposta:

```json
{
  "status": "ok"
}
```

### Criar uma entrega

No Windows:

```cmd
curl -X POST http://localhost:3000/api/entregas -H "Content-Type: application/json" -d "{\"descricao\":\"Entrega de documentos\",\"origem\":\"Maceió\",\"destino\":\"Arapiraca\"}"
```

### Listar entregas

```bash
curl http://localhost:3000/api/entregas
```

### Filtrar por status

```bash
curl "http://localhost:3000/api/entregas?status=EM_TRANSITO"
```

### Buscar uma entrega

```bash
curl http://localhost:3000/api/entregas/1
```

A resposta inclui a propriedade `historico` com os eventos registrados para a entrega.

### Avançar o status

```bash
curl -X PATCH http://localhost:3000/api/entregas/1/avancar
```

O fluxo normal é:

```text
CRIADA → EM_TRANSITO → ENTREGUE
```

### Cancelar uma entrega

```bash
curl -X PATCH http://localhost:3000/api/entregas/1/cancelar
```

### Ver o histórico

```bash
curl http://localhost:3000/api/entregas/1/historico
```


### Criar um motorista

```cmd
curl -X POST http://localhost:3000/api/motoristas -H "Content-Type: application/json" -d "{\"nome\":\"João da Silva\",\"cpf\":\"12345678900\",\"placaVeiculo\":\"ABC1D23\"}"
```

O motorista é criado com status `ATIVO`.

### Listar motoristas

```bash
curl http://localhost:3000/api/motoristas
```

### Buscar um motorista

```bash
curl http://localhost:3000/api/motoristas/1
```

### Listar entregas de um motorista

```bash
curl http://localhost:3000/api/motoristas/1/entregas
```

### Filtrar entregas de um motorista por status

```bash
curl "http://localhost:3000/api/motoristas/1/entregas?status=CRIADA"
```

### Atribuir motorista a uma entrega

```cmd
curl -X PATCH http://localhost:3000/api/entregas/1/atribuir -H "Content-Type: application/json" -d "{\"motoristaId\":1}"
```

A atribuição só é permitida quando a entrega está com status `CRIADA` e o motorista está `ATIVO`.

## Estrutura do projeto

```text
prisma/
├── migrations/
└── schema.prisma

src/
├── controllers/
├── database/
├── generated/
├── repositories/
├── routes/
└── services/
```

- **Controllers:** recebem as requisições e retornam as respostas.
- **Services:** concentram as regras de negócio.
- **Repositories:** cuidam do acesso aos dados por meio do Prisma.
- **Database:** mantém a instância compartilhada do Prisma Client.
- **Routes:** definem as rotas e organizam as dependências.
- **Generated:** arquivos gerados pelo Prisma.

## Autograder

Com o servidor rodando, abra outro terminal e execute:

```bash
npm run check
```

## Persistência

As entregas, os motoristas e os eventos do histórico são armazenados no SQLite. Os dados continuam disponíveis após reiniciar o servidor.

## Diagrama da composição das dependências

```text
                         ┌──────────────────────┐
                         │ Prisma Client        │
                         │ (Database singleton) │
                         └──────────┬───────────┘
                                    │
                ┌───────────────────┴───────────────────┐
                │                                       │
                ▼                                       ▼
     ┌────────────────────┐                ┌──────────────────────┐
     │ EntregasRepository │                │ MotoristasRepository │
     └─────────┬──────────┘                └──────────┬───────────┘
               │                                      │
               ▼                                      ▼
     ┌────────────────────┐                ┌──────────────────────┐
     │  EntregasService   │◄──────────────►│  MotoristasService   │
     └─────────┬──────────┘                └──────────┬───────────┘
               │                                      │
               ▼                                      ▼
     ┌────────────────────┐                ┌──────────────────────┐
     │ EntregasController │                │ MotoristasController │
     └─────────┬──────────┘                └──────────┬───────────┘
               │                                      │
               └───────────────────┬──────────────────┘
                                   ▼
                                 Routes
```

A composição das dependências ocorre em um único ponto (`src/routes/index.js`). Os repositories acessam o banco pelo Prisma Client compartilhado, enquanto os services recebem os repositories por injeção de dependência.
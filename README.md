# Delivery Tracker API

Projeto da Atividade 05 de Programação Web.

A aplicação é uma API para cadastro e acompanhamento de entregas, feita com Node.js e Express. O projeto utiliza arquitetura em camadas, separando as rotas, controllers, services e repositories.

## Como executar

É necessário ter o Node.js e o npm instalados.

Na pasta do projeto, execute:

```bash
npm install
```

Depois:

```bash
npm start
```

A API ficará disponível em:

```text
http://localhost:3000
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

```bash
curl -X POST http://localhost:3000/api/entregas ^
  -H "Content-Type: application/json" ^
  -d "{\"descricao\":\"Entrega de documentos\",\"origem\":\"Maceió\",\"destino\":\"Arapiraca\"}"
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

## Estrutura do projeto

```text
src/
├── controllers/
├── services/
├── repositories/
├── database/
├── routes/
└── utils/
```

- **Controllers:** recebem as requisições e retornam as respostas.
- **Services:** concentram as regras de negócio.
- **Repositories:** cuidam dos dados.
- **Database:** mantém os dados em memória.
- **Routes:** definem as rotas e organizam as dependências.
- **Utils:** pasta para funções auxiliares (acabei não usando, mas continua no arquivo pela estrutura do projeto).

## Autograder

Com o servidor rodando, abra outro terminal e execute:

```bash
npm run check
```

## Observação

Os dados ficam somente em memória. Por isso, eles são perdidos quando o servidor é encerrado ou reiniciado.

Esta atividade trabalha com as funcionalidades de **Entregas**. As funcionalidades de Motoristas ficam para a atividade seguinte (atividade 06).
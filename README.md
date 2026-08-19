# Expense Tracker

A local-first expense ledger with a small REST API and browser interface. The API contract is intentionally persistence-agnostic so MongoDB, Postgres, or a hosted finance provider can be connected later.

## Run

```bash
npm test
npm start
```

Open `http://localhost:3000`.

Endpoints:

- `GET /api/health`
- `GET /api/expenses`
- `POST /api/expenses` with `description`, positive `amount`, and `category`
- `GET /api/summary`

The current process stores records in memory for development. Add a repository adapter before using it for durable or multi-user financial data.

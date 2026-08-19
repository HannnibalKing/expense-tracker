const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const expenses = [];
const port = Number(process.env.PORT || 3000);

function json(response, status, value) { response.writeHead(status, { 'Content-Type': 'application/json' }); response.end(JSON.stringify(value)); }
function readBody(request) { return new Promise((resolve, reject) => { let body = ''; request.on('data', chunk => { body += chunk; }); request.on('end', () => { try { resolve(JSON.parse(body || '{}')); } catch (error) { reject(error); } }); }); }
function validate(item) { return Boolean(typeof item.description === 'string' && item.description.trim() && Number.isFinite(Number(item.amount)) && Number(item.amount) > 0 && typeof item.category === 'string' && item.category.trim()); }
function summary() { return expenses.reduce((result, expense) => { result.total += expense.amount; result.byCategory[expense.category] = (result.byCategory[expense.category] || 0) + expense.amount; return result; }, { total: 0, byCategory: {} }); }

const server = http.createServer(async (request, response) => {
  if (request.url === '/api/health' && request.method === 'GET') return json(response, 200, { status: 'ok' });
  if (request.url === '/api/expenses' && request.method === 'GET') return json(response, 200, { expenses, summary: summary() });
  if (request.url === '/api/expenses' && request.method === 'POST') {
    try {
      const item = await readBody(request);
      if (!validate(item)) return json(response, 400, { error: 'description, positive amount, and category are required' });
      const expense = { id: crypto.randomUUID(), description: item.description.trim(), amount: Number(item.amount), category: item.category.trim(), date: item.date || new Date().toISOString().slice(0, 10) };
      expenses.push(expense);
      return json(response, 201, expense);
    } catch { return json(response, 400, { error: 'invalid JSON' }); }
  }
  if (request.url === '/api/summary' && request.method === 'GET') return json(response, 200, summary());
  const file = request.url === '/' ? 'index.html' : request.url.slice(1);
  const filePath = path.join(__dirname, file);
  if (request.method === 'GET' && filePath.startsWith(__dirname) && fs.existsSync(filePath)) { response.writeHead(200, { 'Content-Type': filePath.endsWith('.css') ? 'text/css' : 'text/html' }); return fs.createReadStream(filePath).pipe(response); }
  json(response, 404, { error: 'not found' });
});

module.exports = { validate, summary, expenses };
if (require.main === module) server.listen(port, () => console.log(`Expense tracker running on http://localhost:${port}`));

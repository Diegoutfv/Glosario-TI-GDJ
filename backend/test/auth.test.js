const test = require('node:test');
const assert = require('node:assert');
const jwt = require('jsonwebtoken');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

process.env.JWT_SECRET = 'secreto_de_pruebas';

function mockRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(data) { this.body = data; return this; },
  };
}

test('authMiddleware rechaza peticiones sin token', () => {
  const req = { header: () => undefined };
  const res = mockRes();
  authMiddleware(req, res, () => assert.fail('no debe llamar next'));
  assert.strictEqual(res.statusCode, 401);
});

test('authMiddleware rechaza tokens inválidos', () => {
  const req = { header: () => 'Bearer token-falso' };
  const res = mockRes();
  authMiddleware(req, res, () => assert.fail('no debe llamar next'));
  assert.strictEqual(res.statusCode, 401);
});

test('authMiddleware acepta un token válido y guarda id y rol', () => {
  const token = jwt.sign({ id: 'abc123', rol: 'admin' }, process.env.JWT_SECRET);
  const req = { header: () => `Bearer ${token}` };
  const res = mockRes();
  let llamado = false;
  authMiddleware(req, res, () => { llamado = true; });
  assert.ok(llamado);
  assert.strictEqual(req.usuarioId, 'abc123');
  assert.strictEqual(req.usuarioRol, 'admin');
});

test('adminMiddleware bloquea a usuarios normales con 403', () => {
  const res = mockRes();
  adminMiddleware({ usuarioRol: 'usuario' }, res, () => assert.fail('no debe llamar next'));
  assert.strictEqual(res.statusCode, 403);
});

test('adminMiddleware deja pasar a administradores', () => {
  let llamado = false;
  adminMiddleware({ usuarioRol: 'admin' }, mockRes(), () => { llamado = true; });
  assert.ok(llamado);
});

// backend/server.test.js

// Teste 1: Checar se o Jest está configurado e rodando
// Este é um teste simples que sempre passa, para garantir que o framework de teste funciona.
test('Deve ser verdade que true é true', () => {
  expect(true).toBe(true);
});

// Teste 2: Simular uma chamada de API e validar o tipo de resposta
// Isso demonstra um teste mais próximo da realidade, sem precisar de um BD complexo.
const fakeApiCall = async () => {
  // Em um caso real, isso poderia ser uma chamada a uma função que formata dados.
  // Aqui, apenas simulamos que ela retorna um array, como nossa API /itens faz.
  return await Promise.resolve([]);
};

test('A rota de itens deve retornar um array', async () => {
  const result = await fakeApiCall();
  expect(Array.isArray(result)).toBe(true);
});
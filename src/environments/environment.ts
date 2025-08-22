export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  mercadopago: {
    accessToken: 'TEST-1234567890abcdef-1234-1234-1234-1234567890ab', // Token de teste
    publicKey: 'TEST-12345678-1234-1234-1234-123456789012',
    sandbox: true, // true para ambiente de teste, false para produção
    webhookUrl: 'http://localhost:8080/webhooks/mercadopago',
  },
};

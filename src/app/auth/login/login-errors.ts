// error-messages.ts
export const ERROR_MESSAGES_LOGIN: { [key: string]: string } = {
  '9': 'Usuário ou senha incorretos.',
  '3': 'Seu endereço de e-mail está aguardando verificação.',
  '424':
    'Ocorreu um erro inesperado na dependência: DATABASE. Tente novamente mais tarde.',
  '429':
    'Você excedeu o limite de tentativas. Por favor, tente novamente em alguns minutos.',
  '500': 'Ocorreu um erro interno. Por favor, tente novamente.',
  // Erro genérico
  default: 'Erro ao realizar login. Tente novamente.',
};

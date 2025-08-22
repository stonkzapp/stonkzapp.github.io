# Stonkz Frontend

Aplicação frontend para o sistema Stonkz, desenvolvida em Angular 19.

## 🚀 Deploy no GitHub Pages

### Configuração Automática

O projeto está configurado para fazer deploy automático no GitHub Pages através do GitHub Actions.

**Para ativar:**

1. **Habilitar GitHub Pages:**

   - Vá para `Settings` > `Pages` no seu repositório
   - Em `Source`, selecione `GitHub Actions`

2. **Configurar branch:**

   - Certifique-se de que a branch principal é `main`
   - O workflow será executado automaticamente a cada push

3. **Primeiro deploy:**
   - Faça um push para a branch `main`
   - O GitHub Actions irá construir e fazer deploy automaticamente

### Configuração Manual

Se preferir fazer deploy manual:

```bash
# Instalar dependências
npm install

# Build para produção
npm run build:gh-pages

# Os arquivos serão gerados na pasta `docs/`
# Faça commit e push da pasta `docs/`
```

### Estrutura de Arquivos

- `outputPath`: `docs/` (configurado no `angular.json`)
- `baseHref`: `/stonkz-frontend/` (ajuste para o nome do seu repositório)
- Workflow: `.github/workflows/deploy.yml`

## 🛠️ Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento
npm start

# Build para produção
npm run build

# Testes
npm test
```

## 📱 Funcionalidades

- Sistema de carteiras múltiplas
- Autenticação com múltiplos provedores
- Painel administrativo
- Sistema de assinaturas
- Interface responsiva

## 🔧 Tecnologias

- Angular 19
- Angular Material
- RxJS
- SCSS
- TypeScript

## 📄 Licença

Este projeto é privado e proprietário.

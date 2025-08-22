# 🚀 Deploy Rápido - GitHub Pages

## Opção 1: Deploy Automático (Recomendado)

### 1. Configurar GitHub Pages

- Vá para seu repositório no GitHub
- Settings → Pages
- Source: Deploy from a branch
- Branch: `gh-pages` (será criado automaticamente)
- Folder: `/ (root)`
- Save

### 2. Push para Main

```bash
git add .
git commit -m "🚀 Adiciona modo mock para desenvolvimento"
git push origin main
```

### 3. Aguardar Deploy

- O GitHub Actions fará o deploy automaticamente
- Aguarde ~2-3 minutos
- Acesse: `https://<seu-usuario>.github.io/<repo>/`

## Opção 2: Deploy Manual

### 1. Build Local

```bash
npm install
npm run build
```

### 2. Deploy Manual

```bash
# Usar o script automatizado
chmod +x deploy-gh-pages.sh
./deploy-gh-pages.sh

# OU fazer manualmente:
git add docs/
git commit -m "🚀 Deploy: Build para GitHub Pages"
git push origin main
```

## ✅ Verificação

### 1. Acesse a URL

- `https://<seu-usuario>.github.io/<repo>/`

### 2. Teste o Modo Mock

- Badge "DEV" visível no header
- Login automático funcionando
- Todas as rotas protegidas acessíveis

### 3. Teste no Celular

- Acesse a mesma URL no celular
- Teste a responsividade
- Verifique todas as funcionalidades

## 🔧 Configurações

### Modo Mock

```typescript
// src/app/core/config/mock.config.ts
ENABLE_MOCK_MODE: true; // Sempre true para desenvolvimento
```

### Usuário Padrão

- Email: `usuario@teste.com`
- Senha: qualquer valor
- Nome: "Usuário Teste"

## 📱 URLs de Teste

### Desktop

- `https://<usuario>.github.io/<repo>/`

### Mobile

- Mesma URL, responsiva automaticamente

### Funcionalidades Testáveis

- ✅ Login/Logout
- ✅ Dashboard completo
- ✅ Perfil do usuário
- ✅ Navegação protegida
- ✅ Responsividade

## 🚨 Troubleshooting

### Deploy não funciona

1. Verifique se o branch é `main`
2. Verifique se o GitHub Actions está ativo
3. Verifique se o GitHub Pages está configurado

### Modo mock não funciona

1. Verifique `ENABLE_MOCK_MODE: true`
2. Limpe o localStorage do navegador
3. Recarregue a página

### Rotas protegidas não funcionam

1. Verifique se o usuário mock foi criado
2. Verifique o console do navegador
3. Verifique se o AuthGuard está funcionando

## 📚 Documentação Completa

- **Modo Mock**: `MOCK_MODE_README.md`
- **Script de Deploy**: `deploy-gh-pages.sh`
- **GitHub Actions**: `.github/workflows/deploy.yml`

---

**🎯 Resultado Final**: Seu projeto funcionando 100% no celular com todas as funcionalidades, sem necessidade de backend!

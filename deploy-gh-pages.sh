#!/bin/bash

# Script para deploy no GitHub Pages
# Stonkz Frontend - Modo Mock

echo "🚀 Iniciando deploy para GitHub Pages..."

# Verificar se estamos no branch main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ Erro: Deploy deve ser feito do branch main"
    echo "Branch atual: $CURRENT_BRANCH"
    exit 1
fi

# Verificar se há mudanças não commitadas
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Erro: Há mudanças não commitadas"
    echo "Por favor, commit ou stash suas mudanças antes do deploy"
    git status --short
    exit 1
fi

# Verificar se o remote origin está configurado
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ Erro: Remote origin não configurado"
    echo "Configure o remote com: git remote add origin <URL_DO_SEU_REPO>"
    exit 1
fi

echo "✅ Verificações passaram"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

# Build do projeto
echo "🔨 Fazendo build do projeto..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro no build"
    exit 1
fi

echo "✅ Build concluído com sucesso"

# Verificar se o build foi criado
if [ ! -d "docs" ]; then
    echo "❌ Erro: Pasta docs não encontrada após build"
    echo "Verifique se o angular.json está configurado para outputPath: 'docs'"
    exit 1
fi

# Commit das mudanças do build
echo "📝 Commitando mudanças do build..."
git add docs/
git commit -m "🚀 Deploy: Build para GitHub Pages [$(date +%Y-%m-%d\ %H:%M:%S)]"

# Push para o repositório
echo "⬆️ Fazendo push para o repositório..."
git push origin main

if [ $? -ne 0 ]; then
    echo "❌ Erro ao fazer push"
    exit 1
fi

echo "✅ Deploy concluído com sucesso!"
echo ""
echo "🌐 Seu projeto estará disponível em:"
echo "   https://<SEU_USUARIO>.github.io/<NOME_DO_REPO>/"
echo ""
echo "📱 Para testar no celular:"
echo "   1. Acesse a URL acima"
echo "   2. O modo mock será ativado automaticamente"
echo "   3. Faça login com qualquer email/senha"
echo "   4. Teste todas as funcionalidades"
echo ""
echo "🔧 Configurações do modo mock:"
echo "   - Arquivo: src/app/core/config/mock.config.ts"
echo "   - Usuário padrão: usuario@teste.com"
echo "   - Badge DEV visível no header"
echo ""
echo "📚 Documentação completa: MOCK_MODE_README.md"

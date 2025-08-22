# 🎨 Sistema de Design Tokens Profissional - Stonkz

## ✨ **Visão Geral**

Este documento descreve o sistema de design tokens implementado no Stonkz, baseado nos padrões de mercado das principais plataformas financeiras como **Kinvo**, **Nubank**, **Stripe** e **Inter**.

## 🎯 **Objetivos do Sistema**

- **Consistência visual** em toda a aplicação
- **Transições suaves** entre light e dark mode
- **Manutenibilidade** através de variáveis centralizadas
- **Escalabilidade** para futuras funcionalidades
- **Acessibilidade** com contraste adequado
- **Performance** com transições otimizadas

## 🌟 **Estrutura dos Tokens**

### **1. Tokens Base (Sempre Ativos)**

```scss
:root {
  // Cores semânticas
  --color-success: #10b981;
  --color-error: #ef4444;
  --color-warning: #f59e0b;
  --color-info: #3b82f6;

  // Cores de branding
  --color-primary: #6366f1;
  --color-secondary: #8b5cf6;
  --color-accent: #06b6d4;

  // Espaçamentos
  --space-1: 0.25rem; // 4px
  --space-4: 1rem; // 16px
  --space-8: 2rem; // 32px

  // Border radius
  --radius-sm: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16px;

  // Transições
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
}
```

### **2. Light Mode**

```scss
.light-mode {
  // Fundos
  --color-background: #ffffff;
  --color-background-secondary: #f8fafc;
  --color-background-tertiary: #f1f5f9;

  // Textos
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-tertiary: #64748b;

  // Bordas
  --color-border-primary: #e2e8f0;
  --color-border-secondary: #cbd5e1;

  // Cards
  --color-card-background: #ffffff;
  --color-card-border: #e2e8f0;
  --shadow-card: var(--shadow-sm);
}
```

### **3. Dark Mode**

```scss
.dark-mode {
  // Fundos
  --color-background: #0f172a;
  --color-background-secondary: #1e293b;
  --color-background-tertiary: #334155;

  // Textos
  --color-text-primary: #f8fafc;
  --color-text-secondary: #cbd5e1;
  --color-text-tertiary: #94a3b8;

  // Bordas
  --color-border-primary: #334155;
  --color-border-secondary: #475569;

  // Cards
  --color-card-background: #1e293b;
  --color-card-border: #334155;
  --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
}
```

## 🎨 **Paleta de Cores**

### **Cores Semânticas**

- **Sucesso**: `#10b981` (Verde)
- **Erro**: `#ef4444` (Vermelho)
- **Aviso**: `#f59e0b` (Laranja)
- **Info**: `#3b82f6` (Azul)

### **Cores de Branding**

- **Primária**: `#6366f1` (Índigo)
- **Secundária**: `#8b5cf6` (Violeta)
- **Accent**: `#06b6d4` (Ciano)

### **Cores Neutras**

- **Branco**: `#ffffff`
- **Preto**: `#000000`

## 📏 **Sistema de Espaçamento**

### **Escala de Espaçamentos**

```scss
--space-1: 0.25rem; // 4px
--space-2: 0.5rem; // 8px
--space-3: 0.75rem; // 12px
--space-4: 1rem; // 16px
--space-5: 1.25rem; // 20px
--space-6: 1.5rem; // 24px
--space-8: 2rem; // 32px
--space-10: 2.5rem; // 40px
--space-12: 3rem; // 48px
--space-16: 4rem; // 64px
--space-20: 5rem; // 80px
```

### **Uso Recomendado**

- **Margens externas**: `var(--space-4)`, `var(--space-6)`, `var(--space-8)`
- **Padding interno**: `var(--space-3)`, `var(--space-4)`, `var(--space-6)`
- **Gaps entre elementos**: `var(--space-2)`, `var(--space-4)`

## 🔲 **Sistema de Border Radius**

### **Escala de Radius**

```scss
--radius-xs: 2px; // Inputs pequenos
--radius-sm: 4px; // Botões, inputs
--radius-md: 6px; // Cards pequenos
--radius-lg: 8px; // Cards médios
--radius-xl: 12px; // Cards grandes
--radius-2xl: 16px; // Modais, toasts
--radius-full: 9999px; // Círculos
```

### **Uso Recomendado**

- **Inputs**: `var(--radius-md)`
- **Botões**: `var(--radius-md)`
- **Cards**: `var(--radius-lg)` ou `var(--radius-xl)`
- **Toasts**: `var(--radius-2xl)`
- **Avatares**: `var(--radius-full)`

## 🌊 **Sistema de Sombras**

### **Escala de Sombras**

```scss
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

### **Sombras Específicas**

```scss
--shadow-card: var(--shadow-sm);
--shadow-card-hover: var(--shadow-md);
--shadow-nav: var(--shadow-lg);
--shadow-modal: var(--shadow-xl);
--shadow-dropdown: var(--shadow-lg);
```

## 🔤 **Sistema de Tipografia**

### **Família de Fontes**

```scss
--font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### **Tamanhos de Fonte**

```scss
--font-size-xs: 0.75rem; // 12px
--font-size-sm: 0.875rem; // 14px
--font-size-base: 1rem; // 16px
--font-size-lg: 1.125rem; // 18px
--font-size-xl: 1.25rem; // 20px
--font-size-2xl: 1.5rem; // 24px
--font-size-3xl: 1.875rem; // 30px
--font-size-4xl: 2.25rem; // 36px
```

### **Pesos de Fonte**

```scss
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### **Altura de Linha**

```scss
--line-height-tight: 1.25; // Títulos
--line-height-normal: 1.5; // Texto normal
--line-height-relaxed: 1.75; // Texto longo
```

## ⚡ **Sistema de Transições**

### **Durações de Transição**

```scss
--transition-fast: 150ms ease; // Hover, focus
--transition-normal: 250ms ease; // Mudanças de tema
--transition-slow: 350ms ease; // Animações complexas
--transition-slower: 500ms ease; // Transições de página
```

### **Uso Recomendado**

- **Hover/Focus**: `var(--transition-fast)`
- **Mudanças de tema**: `var(--transition-normal)`
- **Animações**: `var(--transition-slow)`
- **Transições de página**: `var(--transition-slower)`

## 🎭 **Componentes Base**

### **Cards**

```scss
.card,
.mat-card {
  background-color: var(--color-card-background);
  border: 1px solid var(--color-card-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  transition: all var(--transition-normal);

  &:hover {
    box-shadow: var(--shadow-card-hover);
    transform: translateY(-2px);
  }
}
```

### **Inputs**

```scss
input,
textarea,
select {
  background-color: var(--color-input-background);
  border: 1px solid var(--color-input-border);
  border-radius: var(--radius-md);
  color: var(--color-input-text);
  padding: var(--space-3) var(--space-4);
  transition: all var(--transition-fast);

  &:hover {
    border-color: var(--color-input-border-hover);
  }

  &:focus {
    border-color: var(--color-input-border-focus);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
}
```

### **Botões**

```scss
button {
  font-family: var(--font-family);
  transition: all var(--transition-fast);

  &:focus {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
  }
}
```

## 📱 **Responsividade**

### **Breakpoints**

```scss
@media (max-width: 768px) {
  :root {
    --space-4: 0.75rem;
    --space-6: 1.25rem;
    --space-8: 1.5rem;
    --font-size-4xl: 2rem;
    --font-size-3xl: 1.75rem;
    --font-size-2xl: 1.375rem;
  }
}

@media (max-width: 480px) {
  :root {
    --space-4: 0.5rem;
    --space-6: 1rem;
    --space-8: 1.25rem;
    --font-size-4xl: 1.75rem;
    --font-size-3xl: 1.5rem;
    --font-size-2xl: 1.25rem;
  }
}
```

## 🎨 **Gradientes**

### **Gradientes Disponíveis**

```scss
--gradient-primary: linear-gradient(
  135deg,
  var(--color-primary),
  var(--color-secondary)
);
--gradient-secondary: linear-gradient(
  135deg,
  var(--color-secondary),
  var(--color-accent)
);
--gradient-accent: linear-gradient(
  135deg,
  var(--color-accent),
  var(--color-primary)
);
```

### **Uso Recomendado**

- **Botões principais**: `var(--gradient-primary)`
- **Elementos especiais**: `var(--gradient-secondary)`
- **Destaques**: `var(--gradient-accent)`

## 🚀 **Como Usar**

### **1. Aplicar em Componentes**

```scss
.meu-componente {
  background-color: var(--color-background);
  color: var(--color-text-primary);
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  transition: all var(--transition-normal);
}
```

### **2. Criar Variações**

```scss
.meu-componente {
  &--variant {
    background-color: var(--color-surface-secondary);
    border: 1px solid var(--color-border-secondary);
  }

  &--elevated {
    background-color: var(--color-surface-elevated);
    box-shadow: var(--shadow-lg);
  }
}
```

### **3. Estados Interativos**

```scss
.meu-componente {
  &:hover {
    background-color: var(--color-surface-hover);
    transform: translateY(-2px);
  }

  &:active {
    background-color: var(--color-surface-active);
  }

  &:focus {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
  }
}
```

## 🔧 **Manutenção e Extensão**

### **Adicionar Novas Cores**

```scss
:root {
  --color-new: #your-color;
  --color-new-light: #your-color-light;
  --color-new-dark: #your-color-dark;
}

.light-mode {
  --color-new-surface: rgba(your-color, 0.1);
}

.dark-mode {
  --color-new-surface: rgba(your-color, 0.2);
}
```

### **Adicionar Novos Espaçamentos**

```scss
:root {
  --space-24: 6rem; // 96px
  --space-32: 8rem; // 128px
}
```

### **Adicionar Novos Radius**

```scss
:root {
  --radius-3xl: 24px;
  --radius-4xl: 32px;
}
```

## 📋 **Checklist de Implementação**

### **✅ Obrigatório**

- [ ] Usar variáveis CSS para todas as cores
- [ ] Usar variáveis CSS para todos os espaçamentos
- [ ] Usar variáveis CSS para todos os border radius
- [ ] Usar variáveis CSS para todas as transições
- [ ] Implementar estados hover/focus/active
- [ ] Testar em light e dark mode

### **✅ Recomendado**

- [ ] Usar gradientes para elementos especiais
- [ ] Implementar animações suaves
- [ ] Adicionar sombras apropriadas
- [ ] Testar responsividade
- [ ] Validar acessibilidade

### **✅ Opcional**

- [ ] Criar variações de componentes
- [ ] Implementar temas customizados
- [ ] Adicionar micro-interações
- [ ] Criar sistema de animações

## 🎯 **Próximos Passos**

1. **Migrar componentes existentes** para usar as novas variáveis
2. **Criar componentes base** reutilizáveis
3. **Implementar sistema de animações** avançado
4. **Criar biblioteca de componentes** documentada
5. **Implementar testes visuais** automatizados

---

**Status:** ✅ **Sistema de Design Tokens Implementado**
**Próximo:** 🔄 **Migração de Componentes Existentes**

**🎨 Agora você tem um sistema de design profissional e escalável!**

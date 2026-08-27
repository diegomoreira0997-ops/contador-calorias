# Rótulo Diário — Contador de Calorias

Aplicativo web de acompanhamento nutricional: registro diário de calorias e macronutrientes, controle de atividades físicas com estimativa de gasto calórico, calculadora de meta calórica (Mifflin-St Jeor) e resumo mensal com gráficos.

## Funcionalidades

- Registro diário de alimentos com busca, autocomplete e atalhos de "adicionar rápido"
- Base de dados com 250+ alimentos (valores nutricionais por 100g)
- Edição inline de nome, quantidade e macronutrientes direto na lista
- Controle de atividades físicas (musculação, futebol) com estimativa de calorias gastas
- Calculadora de meta calórica e de macronutrientes baseada em peso, altura, idade e nível de atividade
- Resumo mensal com gráfico de calorias consumidas por dia
- Interface em português, estilo SaaS minimalista

## Tecnologias

- HTML, CSS e JavaScript puro (sem frameworks ou dependências externas)
- Persistência de dados via `window.storage` (armazenamento local por usuário)

## Como rodar localmente

Basta abrir o arquivo `index.html` em um navegador — não há etapa de build ou instalação de dependências.

Para uma experiência com recarregamento automático durante o desenvolvimento, recomenda-se a extensão **Live Server** no VS Code.

## Estrutura de arquivos

```
├── index.html   # Estrutura da página
├── style.css    # Estilos (design system, cores, componentes)
├── script.js    # Lógica da aplicação (estado, renderização, persistência)
└── README.md
```

## Status do projeto

Em desenvolvimento — próximos passos incluem migração da persistência para um banco de dados real (Supabase) e publicação com deploy automatizado.

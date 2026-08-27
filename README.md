# Rótulo Diário — Contador de Calorias

Aplicativo web de acompanhamento nutricional: registro diário de calorias e macronutrientes, controle de atividades físicas com estimativa de gasto calórico, calculadora de meta calórica (Mifflin-St Jeor) e resumo mensal com gráficos.

## Funcionalidades

- Login e cadastro de conta (Supabase Auth) — cada usuário só acessa os próprios dados
- Registro diário de alimentos com busca, autocomplete e atalhos de "adicionar rápido"
- Base de dados com 250+ alimentos (valores nutricionais por 100g)
- Edição inline de nome, quantidade e macronutrientes direto na lista
- Controle de atividades físicas (musculação, futebol) com estimativa de calorias gastas
- Calculadora de meta calórica e de macronutrientes baseada em peso, altura, idade e nível de atividade
- Resumo mensal com gráfico de calorias consumidas por dia
- Interface em português, estilo SaaS minimalista

## Tecnologias

- HTML, CSS e JavaScript puro (sem frameworks ou dependências externas)
- [Supabase](https://supabase.com) (PostgreSQL + Auth) para persistência de dados e autenticação
- Row Level Security (RLS) ativo em todas as tabelas — cada usuário só lê/escreve as próprias linhas, mesmo com a chave pública exposta no código

## Como rodar localmente

1. Crie um projeto gratuito no [Supabase](https://supabase.com)
2. Rode o arquivo `supabase-schema.sql` deste repositório no SQL Editor do seu projeto (cria as tabelas, ativa RLS e as políticas de acesso)
3. Em `script.js`, troque `SUPABASE_URL` e `SUPABASE_KEY` pelos dados do seu próprio projeto (Settings > API)
4. Abra o `index.html` em um navegador — recomenda-se a extensão **Live Server** no VS Code, para evitar restrições de `file://` no navegador
5. Crie uma conta na tela de login que aparece ao abrir o app

Não há etapa de build nem instalação de dependências — a biblioteca do Supabase é carregada via CDN.

## Estrutura de arquivos

```
├── index.html            # Estrutura da página (inclui tela de login)
├── style.css              # Estilos (design system, cores, componentes)
├── script.js               # Lógica da aplicação (estado, autenticação, renderização, persistência)
├── supabase-schema.sql     # Esquema do banco: tabelas, RLS e políticas de acesso
└── README.md
```

## Status do projeto

Em desenvolvimento. Já concluído: persistência real via Supabase, autenticação de usuários e Row Level Security. Próximo passo: publicação com deploy automatizado (Vercel ou GitHub Pages), para gerar um link público de acesso.

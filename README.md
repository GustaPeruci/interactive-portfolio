# Interactive Portfolio

Portfólio bilíngue (PT-BR / EN) de **Gustavo Assis**, desenvolvedor Full Stack.

**Site:** https://gustaperuci.github.io/interactive-portfolio/

## Conteúdo

- Apresentação profissional, formação e experiência em InfoSoft Sistemas e WEG
- Projetos com estudos de caso: Forge Design System, OpsPilot e Pryzor
- Competências de engenharia, stack e contato
- Tema claro/escuro e idioma português/inglês, com preferências persistidas em `localStorage`
- Filtros de projetos, navegação por âncoras e link de salto para o conteúdo
- Layout responsivo com estilos e tokens inspirados no Forge

## Tecnologias

HTML5, CSS3 e JavaScript nativo. O site não requer build ou framework de frontend. Os testes de navegador usam Playwright no CI.

## Executar localmente

```bash
python3 -m http.server 8000
```

Abra http://localhost:8000.

## Testes

Verificação JavaScript:

```bash
node --check script.js
node --test tests/*.test.mjs
```

Testes de navegador em Chromium (desktop 1440 px, tablet 768 px e mobile 375 px):

```bash
npm install --no-save --package-lock=false @playwright/test@1.56.1
npx playwright install chromium
npx playwright test
```

O Playwright inicia automaticamente um servidor local na porta 4173, valida interações e responsividade e salva capturas e traces em `test-results/`. O CI também disponibiliza esses arquivos como artefatos, quando presentes.

## Deploy

O workflow `.github/workflows/deploy.yml` roda os testes antes de publicar o site no GitHub Pages. Em **Settings → Pages**, a fonte deve estar configurada como **GitHub Actions**.

Acompanhe: https://github.com/GustaPeruci/interactive-portfolio/actions

## Estrutura

```text
.
├── .github/workflows/deploy.yml
├── assets/
│   ├── favicon.svg
│   └── forge.css
├── tests/
│   ├── browser/portfolio.spec.mjs
│   └── portfolio.test.mjs
├── playwright.config.mjs
├── index.html
├── styles.css
├── script.js
└── README.md
```

## Antes de divulgar

- Adicionar o perfil correto do LinkedIn quando o endereço estiver confirmado (a página ainda não apresenta um link para ele).
- Revisar descrições profissionais para garantir que não exponham informações internas ou confidenciais.
- Adicionar o currículo em PDF quando houver uma versão pública revisada.
- Verificar periodicamente se os links externos dos projetos continuam funcionando.

## Licença

Conteúdo profissional e identidade pessoal pertencem ao autor. Nenhuma licença de reutilização está concedida neste repositório.

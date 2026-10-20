# Interactive Portfolio

Portfólio pessoal interativo de **Gustavo Assis**, desenvolvedor Full Stack.

## Funcionalidades

- Interface responsiva, com linguagem visual híbrida inspirada no Forge
- Conteúdo em português e inglês, com preferência persistida localmente
- Tema claro/escuro, respeitando a preferência do sistema
- Seções: apresentação, sobre, experiência, projetos, stack e contato
- Acessibilidade básica, navegação por âncoras e redução de movimento
- Deploy automático com GitHub Actions e GitHub Pages

## Stack

HTML5, CSS3 e JavaScript nativo. Não há build nem instalação de dependências.

## Desenvolvimento local

Clone o repositório e abra `index.html` no navegador. Para testar em um servidor HTTP local:

```bash
python -m http.server 8000
```

Acesse http://localhost:8000.

## Publicação no GitHub Pages

1. Abra **Settings → Pages** no repositório.
2. Em **Build and deployment → Source**, selecione **GitHub Actions**.
3. Abra a aba **Actions** e confira a execução de **Deploy portfolio to GitHub Pages**.
4. Se necessário, execute manualmente pelo botão **Run workflow**.
5. Após sucesso, o endereço será https://gustaperuci.github.io/interactive-portfolio/.

O deploy usa `.github/workflows/deploy.yml` e é acionado por push na branch `main`.

## Personalização antes de divulgar

- Trocar o link genérico de LinkedIn (`https://www.linkedin.com/`) pelo perfil correto em `index.html`.
- Revisar as descrições de experiência profissional e projetos para evitar divulgar informações internas.
- Adicionar PDF do currículo e link de download, quando disponível.
- Integrar tokens/componentes reais do Forge após validar a distribuição pública do pacote.
- Rever links públicos para OpsPilot e para o projeto de conclusão de curso.

## Estrutura

```text
.
├── .github/workflows/deploy.yml
├── assets/favicon.svg
├── index.html
├── styles.css
├── script.js
└── README.md
```

## Licença

Conteúdo profissional e identidade pessoal pertencem ao autor. Nenhuma licença de reutilização está concedida neste repositório.

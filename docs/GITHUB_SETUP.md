# Manual de Configuração do GitHub

## 1. Criar uma Conta no GitHub

1. Acesse [https://github.com](https://github.com)
2. Clique em "Sign up"
3. Preencha os dados solicitados
4. Verifique seu email

## 2. Instalar o Git

1. Windows:
   - Baixe o instalador em [https://git-scm.com/download/windows](https://git-scm.com/download/windows)
   - Execute o instalador e siga as instruções

2. Mac:
   - Abra o Terminal
   - Digite: `brew install git`

3. Linux:
   ```bash
   sudo apt-get update
   sudo apt-get install git
   ```

## 3. Configuração Inicial do Git

Abra o terminal e execute:

```bash
# Configure seu nome
git config --global user.name "Seu Nome"

# Configure seu email (use o mesmo do GitHub)
git config --global user.email "seu.email@exemplo.com"
```

## 4. Criar um Novo Repositório no GitHub

1. Acesse [https://github.com/new](https://github.com/new)
2. Digite o nome do repositório (ex: "acupuntura-anamnese")
3. Escolha "Private" para manter privado
4. Não inicialize com README
5. Clique em "Create repository"

## 5. Preparar o Projeto Local

1. Abra o terminal na pasta do seu projeto
2. Execute os seguintes comandos:

```bash
# Inicializar o Git no projeto
git init

# Criar arquivo .gitignore
echo "node_modules/
.env
.env.local
dist/
.vercel
.DS_Store" > .gitignore

# Adicionar todos os arquivos
git add .

# Criar o primeiro commit
git commit -m "Primeiro commit: Sistema de Anamnese"

# Adicionar o repositório remoto
git remote add origin https://github.com/SEU-USUARIO/acupuntura-anamnese.git

# Enviar o código para o GitHub
git push -u origin main
```

## 6. Rotina Diária de Backup

Sempre que fizer alterações importantes:

```bash
# Verificar alterações
git status

# Adicionar alterações
git add .

# Criar commit com descrição
git commit -m "Descrição das alterações"

# Enviar para o GitHub
git push
```

## 7. Boas Práticas

1. Faça commits frequentes com mensagens descritivas
2. Sempre verifique o status antes de commitar
3. Mantenha o .gitignore atualizado
4. Faça backup em branches diferentes para features grandes

## 8. Comandos Úteis

```bash
# Ver status das alterações
git status

# Ver histórico de commits
git log

# Criar nova branch
git checkout -b nome-da-branch

# Trocar de branch
git checkout nome-da-branch

# Atualizar repositório local
git pull

# Desfazer alterações não commitadas
git checkout .

# Ver branches
git branch
```

## 9. Recuperação de Versões Anteriores

Para voltar a uma versão anterior:

```bash
# Ver histórico com hashes dos commits
git log

# Voltar para um commit específico
git checkout [hash-do-commit]

# Criar nova branch a partir de um commit antigo
git checkout -b recuperacao-[data] [hash-do-commit]
```

## 10. Dicas de Segurança

1. Nunca commite arquivos sensíveis (senhas, chaves API)
2. Mantenha o repositório privado
3. Use branches para testar alterações grandes
4. Faça backup regular do repositório

## 11. Problemas Comuns

1. Erro de push:
   ```bash
   git pull origin main
   git push
   ```

2. Arquivo grande demais:
   ```bash
   # Remover do histórico
   git filter-branch --force --tree-filter 'rm -f arquivo-grande' HEAD
   ```

3. Conflitos de merge:
   ```bash
   # Ver arquivos com conflito
   git status
   
   # Após resolver manualmente
   git add .
   git commit -m "Resolvido conflito em [arquivo]"
   ```

## 12. Links Úteis

- [Documentação do Git](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com)
- [GitHub Desktop](https://desktop.github.com) (interface gráfica)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
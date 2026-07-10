# Tranças Bella - Dashboard & Site

Este projeto é um sistema completo para gerenciamento de serviços de tranças e penteados, incluindo:
- **Site público** com informações, galeria e agendamento.
- **Dashboard administrativo** para controle de clientes, serviços, status e relatórios.

---

## 🚀 Tecnologias utilizadas
- **Angular** (frontend)
- **TypeScript**
- **HTML5 / CSS3**
- **LocalStorage** para persistência simples
- **Responsividade** com media queries

---

## 📂 Estrutura do projeto
- `src/app/pages/home` → Página inicial com galeria e modal de imagens.
- `src/app/pages/servicos` → Lista de serviços e agendamento.
- `src/app/pages/dashboard` → Painel administrativo com status, filtros e ações.
- `src/app/pages/login` → Autenticação simples.
- `src/app/guards/auth.guard.ts` → Proteção de rotas administrativas.

---

## 🔒 Autenticação
- O acesso às rotas administrativas (`/home-admin`, `/servicos-admin`, `/graficos-arquivados`) é protegido pelo **AuthGuard**.
- O login salva `usuarioLogado` no `localStorage`.
- O logout remove essa chave e redireciona para `/login`.

---

## 🖼️ Funcionalidades principais
- **Galeria com modal**: abre imagens em destaque, permite navegar com setas e teclado (← →, ESC).
- **Dashboard administrativo**:
  - Exibe status de agendamentos (Pendentes, Confirmados, Cancelados).
  - Permite confirmar, cancelar ou arquivar serviços.
  - Filtro por status e busca por nome/serviço.
- **Responsividade**:
  - Header e footer adaptados para todas as telas.
  - Menu hambúrguer em mobile/tablet.

---

## ⚙️ Instalação e execução
1. Clone o repositório:
   ```bash
   git clone https://github.com/seuusuario/trancas-bella.git
2. Instale as dependências:
   npm install
3.  Execute o servidor de desenvolvimento:
   ng serve

## 💡 Sugestões de melhoria

- Criar um **manual rápido do Admin** explicando como confirmar, cancelar e arquivar agendamentos.  
- Adicionar **capturas de tela** da Home, Dashboard e Galeria para ilustrar o uso.  
- Incluir uma seção de **Licença** (ex: MIT) caso o projeto seja público.  
- Criar uma seção de **Autores/Contribuidores** para dar crédito.  
- Implementar integração com um **backend real** (Firebase, Node.js) para persistência dos dados.  
- Melhorar autenticação com **JWT** em vez de apenas `localStorage`

## 👩‍💻 Autoria
Projeto desenvolvido por **Ana**, com foco em oferecer uma experiência moderna e prática para clientes e administradores do estúdio **Tranças Bella**.

## 📄 Licença
Este projeto está licenciado sob a licença **MIT** – você pode usar, modificar e distribuir livremente, desde que mantenha os créditos originais e a mesma licença nos trabalhos derivados.

Para mais detalhes, consulte o arquivo [LICENSE](LICENSE).


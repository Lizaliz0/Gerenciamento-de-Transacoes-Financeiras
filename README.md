# API RESTful de Gerenciamento de Transações Financeiras 

Esta API RESTful oferece um conjunto de funcionalidades para o gerenciamento de transações financeiras. Com ela, os usuários podem cadastrar, visualizar, editar e excluir transações, além de obter informações sobre seu perfil e listar categorias disponíveis.

<div align='center'>
  
![screenshot](https://github.com/Lizaliz0/desafio-backend-m03-b2bt05/blob/main/Screenshot_2.png) 
![screenshot](https://github.com/Lizaliz0/desafio-backend-m03-b2bt05/blob/main/Screenshot_3.png) 

</div>

## Rotas e funcionalidades da API?

- `POST /usuario`: Essa é a rota que será utilizada para cadastrar um novo usuario no sistema.
- `POST /login`: Essa é a rota que permite o usuario cadastrado realizar o login no sistema.
- `GET /usuario`: Essa é a rota que será chamada quando o usuario quiser obter os dados do seu próprio perfil.
- `PUT /usuario` : Essa é a rota que será chamada quando o usuário quiser realizar alterações no seu próprio usuário.
- `GET /categoria`: Essa é a rota que será chamada quando o usuario logado quiser listar todas as categorias cadastradas.
- `GET /transacao`: Essa é a rota que será chamada quando o usuario logado quiser listar todas as suas transações cadastradas e incluir um parâmetro filtro do tipo query para que seja possível consultar apenas transações das categorias informadas.
- `GET /transacao/:id`: Essa é a rota que será chamada quando o usuario logado quiser obter uma das suas transações cadastradas.
- `POST /transacao`: Essa é a rota que será utilizada para cadastrar uma transação associada ao usuário logado.
- `PUT /transacao/:id`: Essa é a rota que será chamada quando o usuario logado quiser atualizar uma das suas transações cadastradas. 
- `DELETE /transacao/:id`: Essa é a rota que será chamada quando o usuario logado quiser excluir uma das suas transações cadastradas.  
- `GET /transacao/extrato`: Essa é a rota que será chamada quando o usuario logado quiser obter o extrato de todas as suas transações cadastradas.
- 

## Para executar:

1. Clone este repositório: `git clone git@github.com:Lizaliz0/desafio-backend-m03-b2bt05.git`
2. Navegue até o diretório do projeto: `cd desafio-backend-m03-b2bt05`
3. Instale as dependências: `npm install`
4. Inicie o servidor: `npm run dev`
5. A API estará disponível em: `http://localhost:3333` por padrão.

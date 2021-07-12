
# Desafio Testes unitários

Essa aplicação foi criada duranto o curso da RocketSeat e teve como desafio criar testes unitários e de integração utilizando NodeJS com Typescript. Foram ao todo criados 18 testes unitários e 16 tests de integração onde todas as rotas foram testadas.

## Aplicação FIN API
 Essa aplicação faz a criaçao e gerenciamento de depositos e saques de uma conta de um usuário cadastrado. Para te ajudar a entender melhor o funcionamento da aplicação como um todo, abaixo você verá uma descrição de cada rota e quais parâmetros recebe.

# Rotas de apliacação


### POST <code style="color:red">/api/v1/users</code>

A rota recebe <code style="color:red">name</code>, <code style="color:red">email</code> e <code style="color:red">password</code> dentro do corpo da requisição, salva o usuário criado no banco e retorna uma resposta vazia com status <code style="color:red">201</code>.

**_testes unitários criados para essa rota_**<br>
- [x] _should be able to create a new user_ <br>
- [x] _should not be able to create a new user with the same email_ <br>

**_testes de integração criados para essa rota_**<br>

- [x] _should be able to create a new user_ <br>
- [x] _should not be able to create a new user with the same email_ <br>

### POST <code style="color:red">/api/v1/sessions</code>

A rota recebe <code style="color:red">email</code> e <code style="color:red">password</code> no corpo da requisição e retorna os dados do usuário autenticado junto à um token JWT.

**_teste unitários criados para essa rota_**<br>
- [x] _should be able to authentica an user_ <br>
- [x] _should not be able to authenticate a non existent user_ <br>
- [x] _should not be able to authenticate with incorrect password_ <br>
- [x] _should not be able to authenticate with incorrect email_ <br>

**_testes de integração criados para essa rota_**<br>
- [x] _should be able to authentica an user_ <br>
- [x] _should not be able to authenticate with incorrect password_ <br>
- [x] _should not be able to authenticate with incorrect email_ <br>


### GET <code style="color:red">/api/v1/profile</code>

A rota recebe um token JWT pelo header da requisição e retorna as informações do usuário autenticado.

**_testes unitários criados para essa rota_**<br>
- [x] _should be able to show atuhenticated user profile_ <br>
- [x] _should not be to show user profile a non existent user_ <br>

**_testes de integração criados para essa rota_**<br>
- [x] _should be able to show atuhenticated user profile_ <br>
- [x] _should not be able to show a non authenticated user_ <br>

### GET <code style="color:red">/api/v1/statements/balance</code>

A rota recebe um token JWT pelo header da requisição e retorna uma lista com todas as operações de depósito e saque do usuário autenticado e também o saldo total numa propriedade <code style="color:red">balance</code>.

**_testes unitários criados para essa rota_**<br>
- [x] _should be able to get balance from account_ <br>
- [x] _should note be able to get a balance from a non existent user_ <br>
- [x] _should be able to get balance correctly_ <br>

**_testes de integração criados para essa rota_**<br>
- [x] _should be able to get balance from account properly_ <br>
- [x] _should note be able to get a balance from a non existent user_ <br>


### POST <code style="color:red">/api/v1/statements/deposit</code>

A rota recebe um token JWT pelo header e <code style="color:red">amount</code> e <code style="color:red">description</code> no corpo da requisição, registra a operação de depósito do valor e retorna as informações do depósito criado com status <code style="color:red">201</code>.

**_testes unitários criados para essa rota_**<br>
- [x] _should be able to create a deposit statement_ <br>
- [x] _should not be able to create a statement with invalid user_ <br>
- [x] _should not be able to create a statement with insufficient funds_ <br>

**_testes de integração criados para essa rota_**<br>
- [x] _should be able to create a deposit statement_ <br>
- [x] _should not be able to create a statement deposit with invalid user_ <br>

### POST <code style="color:red">/api/v1/statements/withdraw</code>
A rota recebe um token JWT pelo header e <code style="color:red">amount</code> e <code style="color:red">description</code> no corpo da requisição, registra a operação de saque do valor (caso o usuário possua saldo válido) e retorna as informações do saque criado com status <code style="color:red">201</code>.

**_testes unitários criados para essa rota_**<br>
- [x] _should be able to create a withdraw statement_ <br>

**_testes de integração criados para essa rota_**<br>
- [x] _should be able to create a withdraw statement_ <br>
- [x] _should not be able to create a statement withdraw with invalid user_ <br>

### GET  <code style="color:red">/api/v1/statements/:statement_id</code>

A rota recebe um token JWT pelo header e o id de uma operação registrada (saque ou depósito) na URL da rota e retorna as informações da operação encontrada.

**_testes unitários criados para essa rota_**<br>
- [x] _should be able to get a statement Operation_ <br>
- [x] _should not be able to get statement operation with invalid User_ <br>
- [x] _should not be able to get statement operation with invalid statement id_ <br>

**_testes de integração criados para essa rota_**<br>
- [x] _should be able to get a statement Operation_ <br>
- [x] _should not be able to get statement operation with invalid User_ <br>
- [x] _should not be able to get statement operation with invalid statement id_ <br>

### GET  <code style="color:red">/api/v1/statements/transfers/:user_id</code>

Essa rota permite fazer transferencia de dinheiro entre usuários autenticados pelo token JWT passada pelo header da requisição. O usuário para qual destina enviar a transferencia é passado pelos parâmetros de rota  <code style="color:red">user_id</code>


## Tecnologias utilizadas

* NodeJS/TypeScript
* Express.js
* Docker
* TypeORM
* JWT (tokens)
* Bcrypt (criptografia para senhas)


## Instalação
Essa aplicação funciona em nodeJS

1. Clonar repositório

```sh
    $ git clone https://github.com/lfml83/FinAPI-unitaryTests.git
```

2. Instalar as depêndencias

```sh
    yarn
```

3. Iniciar o docker

```sh
    docker-compose up
```

4. Rodar as migrations

```sh
    yarn typeorm migration:run
```
5. Criar também a database fin_api_test para rodar os testes de integração no postgres

```sh
    create database fin_api_test
```

6. Rodar todos os testes

```sh
    yarn test
```

# Logística com Gerenciamento de Transporte

Este projeto consiste no desenvolvimento de uma interface para possibilitar o acompanhamento das entregas de uma transportadora.

## Tecnologias Utilizadas
- **Framework**: Angular (versão 16 ou superior)
- **Linguagem**: TypeScript
- **Gerenciamento de Estado**: RxJS e/ou NgRx
- **UI Library**: Angular Material
- **Backend Simulado**: json-server
- **Testes**: Jasmine & Karma

## Funcionalidades
### Dashboard
- Exibir o andamento das entregas por motorista
- Exibir entregas malsucedidas por motorista
- Exibir andamento das entregas por bairro

### Lista de Entregas
- Paginação de 10 em 10 registros
- Filtros por motorista e status

## Requisitos do Sistema
1. Implementar boas práticas de desenvolvimento (Clean Code, SOLID, DRY)
2. Utilizar roteamento para navegação entre as views
3. Incluir testes unitários

## Instalação e Execução do Projeto
```sh
# Clonar o repositório
git clone https://github.com/Thais-Mont/logistc-delivery.git 
cd logistic-dashboard

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento e a API simulada
npm start
```
A aplicação será executada em `http://localhost:4200`, enquanto o json-server rodará em `http://localhost:3000`.

## Scripts Disponíveis
```sh
# Iniciar a aplicação e o json-server
npm start

## Testes
Para rodar os testes unitários, utilize o seguinte comando:
```sh
npm run test
```
Os testes são executados com Jasmine e Karma, garantindo a qualidade do código.


## Licença
Este projeto está sob a licença MIT.



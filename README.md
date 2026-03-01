# financial

## Descrição

O **financial** é uma API REST desenvolvida em Go para gerenciamento de transações financeiras. O projeto oferece funcionalidades para criar, listar e acompanhar transações, além de gerar relatórios mensais de resumo financeiro.

### Principais funcionalidades:
- Criação de transações financeiras
- Listagem de transações
- Relatório de resumo mensal

### Arquitetura:
O projeto segue os princípios de **Arquitetura Hexagonal** (Ports and Adapters), organizando o código em camadas bem definidas:
- **Core/Domain**: Entidades e regras de negócio (centro do hexágono)
- **Core/Usecase**: Casos de uso da aplicação (ainda no centro)
- **Adapters**: Interfaces HTTP e repositórios (borda do hexágono)
- **Ports**: Interfaces que conectam o core com os adapters

Esta arquitetura torna a aplicação independente de tecnologias externas e facilita testes unitários.

## Comandos Principais

### Iniciar a aplicação

Para iniciar a API em modo de desenvolvimento:

```bash
air
```

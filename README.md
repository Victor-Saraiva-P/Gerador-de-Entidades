# Gerador de Entidades para Spring Boot

## Descrição

Este projeto tem como objetivo facilitar a geração de entidades para aplicações desenvolvidas em Spring Boot com Java. A aplicação será totalmente baseada no front-end, sem a necessidade de um back-end, permitindo que os usuários gerem código de maneira rápida e eficiente.

## Funcionamento

1. O usuário informa o nome da classe e os atributos desejados.
2. Os atributos são digitados manualmente, incluindo o nome e o tipo (ex.: `String`, `Integer`, `LocalDate`).
3. O sistema faz sugestões de correção para os tipos, recomendando a capitalização correta, com a opção de aceitação automática.
4. O usuário pode marcar opções para adicionar anotações de validação, como:
   - `@NotNull`
   - `@Size(min = X, max = Y)`
   - `@Pattern(regexp = "...")`
   - Entre outras.
5. O código da entidade é gerado em tempo real e exibido na tela para cópia.
6. O layout da aplicação será dividido em duas seções:
   - **Esquerda**: Campos de entrada, incluindo nome da classe e atributos.
   - **Direita**: Código gerado dinamicamente, atualizado em tempo real.
7. Um botão de **"Copiar Código"** permitirá copiar a entidade gerada com facilidade.

## Tecnologias Utilizadas

- **Angular**: Framework escolhido para o desenvolvimento do front-end, permitindo a criação de uma interface dinâmica e responsiva.
- **TypeScript**: Utilizado para garantir um código mais seguro e estruturado.
- **CSS/Tailwind ou Bootstrap**: Para estilização e melhora da usabilidade.

## Objetivos

- Aprimorar conhecimentos em Angular e TypeScript.
- Criar uma ferramenta útil para desenvolvedores que trabalham com Spring Boot.
- Fornecer uma experiência intuitiva com recomendações e assistência na digitação de tipos.

## Possíveis Melhorias Futuras

- Suporte a templates reutilizáveis.
- Opção para exportar a classe gerada como arquivo `.java`.
- Integração com outras ferramentas de desenvolvimento.

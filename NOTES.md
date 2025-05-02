# Notas do projeto

Esse é um projeto que irei desenvolver o desafio do daily diet API para treinar o cap. de rotas e HTTP da formação de nodeJS da rocketseat.
Essa notas vai servir como um caderno de anotações de comandos ou coisas importantes para fixação do aprendizado.

## Inicialização package.json
1. `npm init -y` -> vai iniciar o arquivo package.json.
2. dentro do arquivo, deve definir `"type": "module"`, para usar o sistema de ES Modules invés do CommonJS.

| Característica       | CommonJS                  | ES Modules (ESM)                       |
|----------------------|---------------------------|--------------------------------------  |
| Ambiente principal   | Node.js (versões antigas) | Navegadores e Node.js moderno          |
| Carregamento         | Síncrono                  | Assíncrono                             |
| Sintaxe de import    | `const x = require('x')`  | `import x from 'x'`                    |
| Sintaxe de export    | `module.exports = x`      | `export default x` ou `export { x }`   |
| Extensão comum       | `.js`                     | `.mjs` ou `.js` com `"type": "module"` |
| Suporte em browser   | Não (nativamente)         | Sim                                    |
| Suporte em Node.js   | Sim                       | Sim (versões modernas)                 |

## Dependências

Dependências do projeto.

### Typescript

Como irei utilizar o node com typescript, devo baixar o mesmo como dependência de desenvolvimento e para o usar a tipagem do typescript, deve instalar o types do node: `npm i -D typescript @types/node`.

Depois deve iniciar o arquivo de configuração do typescript, com: `npx tsc --init`. Única alteração inicial no arquivo de conf deve ser o `target`, que deve ser selecionado uma versão mais recente, como a 'ES2020'.

Para converter o arquivo .ts para .js (para o node conseguir executar), basta rodar o comando `npx tsc ./path/arquivo.ts`. Com isso irá criar um arquivo .js e aí poderá executar o arquivo com o comando `node ./path/out.js`.

### Typescript Execute (TSX)

O tsx é uma dependência que deve ser instalada via de regra como dependência de desenvolvimento, no entanto, dependendo se precisar ser usado por alguma outra dependência que vai ser usado em produção, ai deve ser instalado como dependência.

O tsx é usado para facilitar a vida quando for executar o typescript com node, já que diferente do tsc que converte os arquivos para .js para depois executar (o que faz poluir com tantos arquivos de mesmo nome, só que com extensões diferentes), já o tsx executa o arquivo .ts diretamente, apenas com o comando `npx tsx ./path/arquivo.ts`

## Comandos da CLI do GitHub

É necessário ter instalado a CLI do [GitHub](https://cli.github.com/) no computador.

Lista de comandos:

* `gh auth login`
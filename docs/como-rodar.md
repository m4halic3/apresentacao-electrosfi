# Como rodar a apresentação

Este guia explica como abrir os slides, como apresentar com as notas de fala, como exportar para PDF e o que fazer se algo der errado no dia.

## Requisitos

Para apresentar, basta um navegador atualizado (Chrome, Edge ou Firefox). Não precisa de internet nem de instalar nada.

Para editar e gerar a versão de duplo clique, é preciso ter o **Python 3** instalado. No Linux ele já vem instalado. No Windows, dá para baixar em python.org ou pela Microsoft Store.

## Três formas de abrir

### 1. Duplo clique no `apresentacao.html` (recomendada para o dia da palestra)

Esse arquivo já traz o conteúdo do `slides.md` dentro dele, então abre direto do disco, até mesmo de um pendrive.

Atenção, ele é **gerado** pelo `build.py`. Sempre que o `slides.md` for alterado, rode de novo

```bash
python3 build.py
```

senão o `apresentacao.html` continua com a versão antiga.

### 2. Servidor local com Python (recomendada para editar)

Na pasta da apresentação, rode

```bash
python3 -m http.server 8000
```

e abra `http://localhost:8000`. O `index.html` lê o `slides.md` a cada recarregamento, então é só salvar o Markdown e apertar `F5`. Para parar o servidor, use `Ctrl + C` no terminal.

> Por que precisa de servidor? Por segurança, o navegador não deixa uma página aberta direto do disco ler outro arquivo (o `slides.md`). Se o `index.html` for aberto com duplo clique, aparece um aviso explicando isso.

### 3. Outras opções de servidor

Qualquer servidor de arquivos estáticos funciona. Por exemplo, a extensão **Live Server** do VS Code (botão “Go Live” com o `index.html` aberto) ou, com Node.js instalado, o comando `npx serve .`.

## Apresentando

1. Abra a apresentação e aperte `F` para tela cheia.
2. Aperte `S` para abrir a **janela do apresentador**. Ela mostra o slide atual, o próximo, as notas de fala e um cronômetro. Arraste essa janela para o seu notebook e deixe a tela cheia no projetor.
3. Avance com `→` ou `espaço`. No slide da pergunta inicial, cada clique revela uma resposta.

| Tecla | O que faz |
|---|---|
| `→`, `espaço`, `Page Down` | Avança |
| `←`, `Page Up` | Volta |
| `F` | Tela cheia |
| `S` | Janela do apresentador |
| `O` ou `Esc` | Visão geral dos slides |
| `B` ou `.` | Tela preta (aperte de novo para voltar) |
| `Home` / `End` | Primeiro / último slide |

Passadores de slide (aqueles controles com laser) funcionam normalmente, porque enviam as teclas `Page Down` e `Page Up`.

Para abrir direto num slide específico, acrescente o número no endereço. Por exemplo, `apresentacao.html#/11` abre o slide dos próximos passos (a contagem começa em 0 na capa).

### Sobre as animações

As ondas da capa e do encerramento e as três simulações (guia de onda, malha e servidores) só ficam animadas quando o slide delas está na tela, para não pesar o computador. A simulação do guia de onda já começa “aquecida”, com a onda presa no núcleo.

## Checklist para o dia

- Testar o `apresentacao.html` **no computador que vai ser usado**, ligado no projetor.
- Levar a pasta inteira num pendrive. O `apresentacao.html` precisa das pastas `assets` e `vendor` ao lado dele.
- Conferir o tempo com o cronômetro da janela do apresentador num ensaio.

## Exportar para PDF

O PDF serve para enviar os slides depois da palestra. As animações aparecem paradas, como uma foto.

1. Abra a apresentação pelo servidor local ou pelo `apresentacao.html`.
2. Acrescente `?print-pdf` ao endereço, antes do `#`. Exemplo, `http://localhost:8000/?print-pdf` ou `apresentacao.html?print-pdf`.
3. Aperte `Ctrl + P` no **Chrome ou Edge**.
4. Escolha “Salvar como PDF”, layout **Paisagem**, margens **Nenhuma** e marque **Gráficos de plano de fundo**.

Para incluir as notas de fala no PDF, use `?print-pdf&showNotes=true`.

## Solução de problemas

| O que aconteceu | O que fazer |
|---|---|
| Apareceu a tela “Quase lá!” | O `index.html` foi aberto com duplo clique. Use o `apresentacao.html` ou rode o servidor local. |
| Editei o `slides.md` e nada mudou | No `apresentacao.html`, rode `python3 build.py` de novo. No servidor local, recarregue com `Ctrl + F5`. |
| `python3` não é reconhecido (Windows) | Tente `python` ou `py` no lugar de `python3`. |
| A porta 8000 está ocupada | Use outra, por exemplo `python3 -m http.server 8080`. |
| As fontes ficaram diferentes | Confira se a pasta `vendor/fonts` está ao lado do HTML. |
| A janela do apresentador não abre | O navegador bloqueou o pop-up. Permita pop-ups para a página e aperte `S` de novo. |
| As animações estão travando | Feche outras abas e programas. Se continuar, use o Chrome, que costuma ser mais leve com animações em canvas. |
| Slides cortados ou pequenos no projetor | Aperte `F` para tela cheia. Os slides são 16:9 e se ajustam sozinhos à tela. |

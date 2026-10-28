# Como editar a apresentação

Todo o conteúdo fica no `slides.md`. O visual fica no `assets/tema.css` e as animações no `assets/ondas.js`. Não é preciso mexer na pasta `vendor`.

Depois de qualquer mudança, rode `python3 build.py` para atualizar o `apresentacao.html`.

## Estrutura do `slides.md`

Cada slide é separado por uma linha contendo só `---`, com uma linha em branco antes e outra depois.

```markdown
<!-- .slide: class="claro" data-background-color="#F1F5EE" -->

<p class="eyebrow">Texto pequeno acima do título</p>

## Título do slide

<p class="lead">Parágrafo principal.</p>

Note:
Tudo o que vem depois de "Note:" vira nota de fala e só aparece na janela do apresentador.

---

(próximo slide)
```

Algumas regras do Markdown dentro dos slides:

- Títulos podem ser escritos com `#` (título grande) e `##` (título de slide).
- Os blocos com layout (cartões, grades) são escritos em HTML. Dentro de um bloco HTML, **não deixe linhas em branco**, senão o Markdown quebra o bloco.
- Não comece linhas com quatro espaços, porque o Markdown transforma isso em bloco de código.
- As notas (`Note:`) devem ser a última coisa do slide.

## Tipos de slide

A primeira linha de cada slide define o fundo.

| Tipo | Linha | Quando usar |
|---|---|---|
| Escuro | `<!-- .slide: class="escuro" data-background-color="#0B2B22" -->` | Slides de conteúdo e com simulação |
| Claro | `<!-- .slide: class="claro" data-background-color="#F1F5EE" -->` | Slides de conteúdo, alternando com os escuros |
| Destaque | `<!-- .slide: class="destaque" data-background-color="#3DDC97" -->` | Momentos em que a turma participa (pergunta inicial) |
| Capa | `<!-- .slide: class="escuro capa" data-background-color="#0B2B22" -->` | Capa e encerramento, com ondas de fundo |

## Componentes prontos

| Componente | Código | Resultado |
|---|---|---|
| Sobretítulo | `<p class="eyebrow">O problema</p>` | Texto pequeno em maiúsculas, verde |
| Parágrafo principal | `<p class="lead">...</p>` | Texto de 32 px |
| Frase manuscrita | `<p class="caveat">...</p>` | Frase de efeito com fonte de caneta |
| Etiqueta | `<span class="pill">...</span>` | Pílula verde (`pill lima` para a versão lima) |
| Número grande | `<p class="numero">64</p>` | Número de destaque |
| Grade | `<div class="grade g3">...</div>` | Cartões lado a lado (`g2`, `g3` ou `g5`) |
| Cartão | `<div class="cartao"><h3>Título</h3><p>Texto</p></div>` | Caixa com borda |
| Cartão destacado | `<div class="cartao realce">` | Borda verde mais forte |
| Cartão invertido | `<div class="cartao inverso">` | Cartão escuro, bom em slides claros |
| Clique para revelar | `class="fragment"` em qualquer elemento | Só aparece no próximo clique |

Exemplo de grade com três cartões:

```html
<div class="grade g3">
<div class="cartao"><h3>Primeiro</h3><p>Texto do cartão.</p></div>
<div class="cartao realce"><h3>Segundo</h3><p>Texto do cartão.</p></div>
<div class="cartao"><h3>Terceiro</h3><p>Texto do cartão.</p></div>
</div>
```

## Cores

As cores ficam no começo do `assets/tema.css`, como variáveis. Trocar o valor ali muda a apresentação inteira.

| Variável | Cor | Uso |
|---|---|---|
| `--escuro` | `#0B2B22` | Fundo dos slides escuros e texto escuro |
| `--claro` | `#F1F5EE` | Fundo dos slides claros e texto claro |
| `--menta` | `#3DDC97` | Acento principal e slides de participação |
| `--lima` | `#C5F06B` | Segundo acento (frases manuscritas, números) |
| `--acento-claro` | `#1E7A55` | Verde legível em fundo claro |

Se mudar uma cor de fundo, mude também o `data-background-color` dos slides no `slides.md`, que usa o mesmo valor.

As cores das simulações ficam no começo do `assets/ondas.js`, no objeto `COR`.

## Animações

Uma animação é um `<canvas>` com uma destas classes. O `ondas.js` encontra o canvas pela classe e começa a desenhar.

| Classe | O que mostra | Tamanho usado |
|---|---|---|
| `ondas-fundo` | Ondas coloridas da capa e do encerramento | `width="1920" height="1080"`, dentro de `<div class="fundo-ondas">` |
| `sim sim-guia` | Onda presa num guia de onda reto | `width="120" height="68"` (cada pixel é um bloco da malha) |
| `sim malha-refina` | A mesma peça com malhas cada vez mais finas | `width="792" height="446"` |
| `sim sim-servidores` | Onda atravessando três servidores | `width="792" height="446"` |

Para colocar uma simulação ao lado de um texto, use o mesmo modelo dos slides 5 e 10.

```html
<div class="lado-a-lado">
<div>
<p class="eyebrow">Sobretítulo</p>
<h2>Título</h2>
<p class="lead">Explicação.</p>
</div>
<figure>
<canvas class="sim sim-guia" width="120" height="68" aria-label="Descrição da animação"></canvas>
<figcaption><span class="ponto"></span> Legenda da animação.</figcaption>
</figure>
</div>
```

Para ajustar a simulação do guia de onda, edite a função `simGuia` no `ondas.js`. `LARGURA` é a espessura do núcleo, `FREQ` muda o tamanho das ondas e `ESCALA` muda a intensidade das cores. Valores muito diferentes dos atuais podem deixar a simulação instável (as cores “explodem”).

## Adicionar ou remover um slide

Para adicionar, copie um slide parecido, cole entre dois separadores `---` e troque o conteúdo. Para remover, apague o bloco inteiro junto com um dos separadores. Depois atualize a tabela de roteiro do `README.md`, se quiser mantê-la em dia.

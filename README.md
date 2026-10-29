# ElectrosFI · Palestra para o Ensino Médio Integrado

Apresentação de cerca de 12 minutos que explica, de forma simples, o que é o **ElectrosFI**, simulador eletromagnético em nuvem desenvolvido no IFSP Câmpus Itapetininga, e apresenta o funcionamento do projeto e seus próximos passos.

Os slides são escritos em **Markdown** (`slides.md`) e exibidos com o [reveal.js](https://revealjs.com). Eles incluem animações de onda que rodam dentro dos próprios slides. Tudo funciona **sem internet**, porque o reveal.js e as fontes já vêm dentro da pasta.

## Começo rápido

**Jeito mais fácil (sem instalar nada)**

1. Abra o arquivo `apresentacao.html` com duplo clique (Chrome, Edge ou Firefox).
2. Aperte `F` para tela cheia e use as setas para avançar.

**Jeito para quem vai editar os slides**

```bash
cd apresentacao-electrosfi
python3 -m http.server 8000
```

Depois abra `http://localhost:8000` no navegador. Esse modo lê o `slides.md` direto, então basta salvar o arquivo e recarregar a página (`F5`) para ver a mudança.

Depois de editar, gere de novo a versão de duplo clique com:

```bash
python3 build.py
```

Mais detalhes, atalhos e solução de problemas estão em [`docs/como-rodar.md`](docs/como-rodar.md). Para mexer no conteúdo e no visual, veja [`docs/como-editar.md`](docs/como-editar.md).

## Atalhos durante a palestra

| Tecla | O que faz |
|---|---|
| `→` ou `espaço` | Próximo slide ou próximo clique (pergunta inicial) |
| `←` | Volta |
| `F` | Tela cheia |
| `S` | Abre a janela do apresentador, com as notas de fala e o cronômetro |
| `O` ou `Esc` | Visão geral de todos os slides |
| `B` ou `.` | Escurece a tela (bom para chamar atenção para a fala) |

## Roteiro (cerca de 15 minutos)

| # | Slide | Tempo | Interação |
|---|---|---|---|
| 1 | Capa | 0:30 | Ondas animadas |
| 2 | Levanta a mão quem usou Wi-Fi hoje | 0:45 | Turma levanta a mão, respostas aparecem no clique |
| 3 | Ondas invisíveis estão em todo lugar | 0:45 | |
| 4 | Testar na vida real custa caro | 0:45 | |
| 5 | Ele divide o espaço em blocos | 1:15 | Simulação de um guia de onda reto rodando no slide |
| 6 | Em 3D, a conta explode | 0:45 | Malha ficando cada vez mais fina |
| 7 | Um laboratório de ondas que abre no navegador | 0:45 | |
| 8 | A viagem de uma simulação | 1:00 | |
| 9 | Quatro servidores trabalhando juntos | 0:45 | |
| 10 | Dividir para conquistar | 1:00 | Onda atravessando três servidores, dinâmica com voluntários |
| 11 | Nem tudo deu certo de primeira | 1:00 | |
| 12 | Próximos passos | 1:00 | |
| 13 | A natureza inspira a otimização | 1:00 | Explicação de computação bioinspirada e do Cuckoo Search |
| 14 | Obrigada! Perguntas? | 0:45 | Ondas animadas |

As notas de fala de cada slide estão no próprio `slides.md`, depois da linha `Note:`, e aparecem na janela do apresentador (tecla `S`).

## Estrutura da pasta

```
apresentacao-electrosfi/
├── README.md              este arquivo
├── slides.md              TODO o conteúdo dos slides e as notas de fala
├── index.html             abre o slides.md (precisa de servidor local)
├── apresentacao.html      versão de duplo clique, gerada pelo build.py
├── build.py               gera o apresentacao.html a partir do slides.md
├── assets/
│   ├── tema.css           cores, fontes e componentes (tema verde)
│   ├── fontes.css         fontes locais
│   └── ondas.js           animações de onda e simulações dos slides
├── docs/
│   ├── como-rodar.md      como abrir, apresentar, exportar e resolver problemas
│   └── como-editar.md     como editar texto, cores, slides e animações
└── vendor/                bibliotecas de terceiros (não editar)
    ├── reveal/            reveal.js 5.2.1 com os plugins markdown e notes
    └── fonts/             DM Sans, Space Grotesk e Caveat
```

## De onde vêm as informações

O conteúdo foi escrito com base nos textos e documentos do projeto, que são o relatório parcial e o relatório final da bolsa, os resumos do Congresso de Iniciação Científica do IFSP Itapetininga, do Congresso de Iniciação Científica da Unicamp e do CONICT, e o artigo submetido ao CSBC. Os números do cluster (4 servidores Dell PowerEdge T550, 64 núcleos Intel Xeon 4314, 256 GB de RAM, dois SSDs de 960 GB por servidor, Debian 12) seguem esses documentos.

As animações dos slides são **ilustrações didáticas** feitas para a palestra. Elas resolvem uma versão simplificada da equação da onda em 2D e não são resultados do ElectrosFI.

## Licenças de terceiros

O reveal.js é distribuído sob licença MIT (`vendor/reveal/LICENSE`). As fontes DM Sans, Space Grotesk e Caveat são distribuídas sob a SIL Open Font License 1.1, obtidas pelo projeto Fontsource.

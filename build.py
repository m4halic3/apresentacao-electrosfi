#!/usr/bin/env python3
"""Gera apresentacao.html, uma versão que abre com duplo clique (sem servidor).

O index.html lê o slides.md pela rede, o que o navegador bloqueia quando o
arquivo é aberto direto do disco. Este script copia o conteúdo do slides.md
para dentro do HTML, então o resultado funciona offline e sem servidor.

Uso:
    python3 build.py

Rode de novo sempre que editar o slides.md.
"""
from pathlib import Path

RAIZ = Path(__file__).resolve().parent
MARCADOR = '<section data-markdown="slides.md"></section>'


def main() -> None:
    markdown = (RAIZ / "slides.md").read_text(encoding="utf-8")
    modelo = (RAIZ / "index.html").read_text(encoding="utf-8")

    if MARCADOR not in modelo:
        raise SystemExit(f"Não encontrei {MARCADOR!r} no index.html.")
    if "</textarea>" in markdown:
        raise SystemExit("O slides.md não pode conter a tag </textarea>.")

    embutido = (
        "<section data-markdown>\n<textarea data-template>\n"
        + markdown
        + "\n</textarea>\n</section>"
    )
    saida = RAIZ / "apresentacao.html"
    saida.write_text(modelo.replace(MARCADOR, embutido), encoding="utf-8")
    print(f"Pronto: {saida.name} gerado. Abra com duplo clique.")


if __name__ == "__main__":
    main()

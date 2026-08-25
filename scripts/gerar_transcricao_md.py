from __future__ import annotations

import argparse
import json
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser(description="Converte a transcrição JSON em Markdown pesquisável.")
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--title", default="Transcrição automática")
    parser.add_argument("--source-url", default="")
    args = parser.parse_args()

    payload = json.loads(args.input.read_text(encoding="utf-8"))
    lines = [
        f"# {args.title}",
        "",
        "> Classificação: **Confirmado como transcrição automática**. Pode conter erros de reconhecimento;",
        "> nomes, valores e termos técnicos devem ser conferidos no vídeo antes de uso operacional.",
        "",
    ]
    if args.source_url:
        lines.extend([f"Fonte: {args.source_url}", ""])
    lines.extend(
        [
            f"Idioma detectado: `{payload.get('language')}`",
            f"Probabilidade do idioma: `{payload.get('language_probability')}`",
            f"Duração informada pelo transcritor: `{payload.get('duration')}` segundos",
            "",
            "## Segmentos",
            "",
        ]
    )
    for segment in payload["segments"]:
        lines.append(
            f"- `{segment['start_hms']}–{segment['end_hms']}` {segment['text']}"
        )
    lines.append("")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text("\n".join(lines), encoding="utf-8")


if __name__ == "__main__":
    main()

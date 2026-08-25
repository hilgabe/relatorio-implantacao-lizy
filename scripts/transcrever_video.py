from __future__ import annotations

import argparse
import json
from pathlib import Path

from faster_whisper import WhisperModel


def format_timestamp(seconds: float) -> str:
    total = max(0, int(round(seconds)))
    hours, remainder = divmod(total, 3600)
    minutes, secs = divmod(remainder, 60)
    return f"{hours:02d}:{minutes:02d}:{secs:02d}"


def main() -> None:
    parser = argparse.ArgumentParser(description="Transcreve um vídeo local com marcas de tempo.")
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--model", default="small")
    args = parser.parse_args()

    args.output.parent.mkdir(parents=True, exist_ok=True)
    model = WhisperModel(args.model, device="cpu", compute_type="int8")
    segments_iter, info = model.transcribe(
        str(args.input),
        language="pt",
        beam_size=5,
        vad_filter=True,
        condition_on_previous_text=True,
    )

    segments = []
    for segment in segments_iter:
        text = segment.text.strip()
        if not text:
            continue
        record = {
            "start": round(segment.start, 3),
            "end": round(segment.end, 3),
            "start_hms": format_timestamp(segment.start),
            "end_hms": format_timestamp(segment.end),
            "text": text,
        }
        segments.append(record)
        print(f"[{record['start_hms']} - {record['end_hms']}] {text}", flush=True)

    payload = {
        "source": str(args.input),
        "language": info.language,
        "language_probability": info.language_probability,
        "duration": info.duration,
        "segments": segments,
    }
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()

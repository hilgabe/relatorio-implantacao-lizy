from __future__ import annotations

import argparse
import math
from pathlib import Path

import cv2


def format_timestamp(seconds: float) -> str:
    total = max(0, int(round(seconds)))
    hours, remainder = divmod(total, 3600)
    minutes, secs = divmod(remainder, 60)
    return f"{hours:02d}-{minutes:02d}-{secs:02d}"


def main() -> None:
    parser = argparse.ArgumentParser(description="Extrai quadros periódicos e cria folhas de contato.")
    parser.add_argument("input", type=Path)
    parser.add_argument("output_dir", type=Path)
    parser.add_argument("--interval", type=float, default=15.0)
    parser.add_argument("--columns", type=int, default=4)
    parser.add_argument("--rows", type=int, default=4)
    args = parser.parse_args()

    frames_dir = args.output_dir / "quadros"
    sheets_dir = args.output_dir / "folhas-de-contato"
    frames_dir.mkdir(parents=True, exist_ok=True)
    sheets_dir.mkdir(parents=True, exist_ok=True)

    capture = cv2.VideoCapture(str(args.input))
    fps = capture.get(cv2.CAP_PROP_FPS)
    frame_count = capture.get(cv2.CAP_PROP_FRAME_COUNT)
    duration = frame_count / fps if fps else 0

    timestamps = [i * args.interval for i in range(math.floor(duration / args.interval) + 1)]
    images: list[tuple[float, object]] = []
    for timestamp in timestamps:
        capture.set(cv2.CAP_PROP_POS_MSEC, timestamp * 1000)
        ok, frame = capture.read()
        if not ok:
            continue
        label = format_timestamp(timestamp)
        path = frames_dir / f"{label}.jpg"
        cv2.imwrite(str(path), frame, [int(cv2.IMWRITE_JPEG_QUALITY), 90])
        images.append((timestamp, frame))
    capture.release()

    thumb_width, thumb_height = 480, 270
    per_sheet = args.columns * args.rows
    for sheet_index in range(math.ceil(len(images) / per_sheet)):
        batch = images[sheet_index * per_sheet : (sheet_index + 1) * per_sheet]
        canvas = 255 * cv2.UMat(thumb_height * args.rows, thumb_width * args.columns, cv2.CV_8UC3).get()
        for index, (timestamp, frame) in enumerate(batch):
            thumb = cv2.resize(frame, (thumb_width, thumb_height), interpolation=cv2.INTER_AREA)
            cv2.rectangle(thumb, (0, 0), (175, 30), (0, 0, 0), -1)
            cv2.putText(
                thumb,
                format_timestamp(timestamp).replace("-", ":"),
                (8, 22),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.65,
                (255, 255, 255),
                2,
                cv2.LINE_AA,
            )
            row, column = divmod(index, args.columns)
            y0, x0 = row * thumb_height, column * thumb_width
            canvas[y0 : y0 + thumb_height, x0 : x0 + thumb_width] = thumb
        cv2.imwrite(str(sheets_dir / f"folha-{sheet_index + 1:02d}.jpg"), canvas, [int(cv2.IMWRITE_JPEG_QUALITY), 88])

    print(f"duration_seconds={duration:.3f}")
    print(f"frames_extracted={len(images)}")
    print(f"contact_sheets={math.ceil(len(images) / per_sheet)}")


if __name__ == "__main__":
    main()

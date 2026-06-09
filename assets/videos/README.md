# Drop your demo videos here

Put `.mp4` files in this folder, then point each demo at it in `data/demos.json`:

```json
{
  "id": "agent-framework",
  "type": "video",
  "src": "assets/videos/agent-framework.mp4",
  "thumbnail": "assets/thumbnails/agent-framework.jpg"
}
```

Tips for customer-ready playback:
- **Format:** H.264 MP4, AAC audio — universally supported in browsers.
- **Resolution:** 1920×1080 (16:9) matches the card/modal aspect ratio.
- **Size:** aim for < 25 MB per clip so the page stays fast. Compress with HandBrake or `ffmpeg -vcodec libx264 -crf 24`.
- **Length:** 90–180 seconds keeps executive attention.
- **`thumbnail`** is optional — without it the card shows a branded gradient preview.

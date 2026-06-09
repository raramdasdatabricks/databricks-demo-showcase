# Drop your demo GIFs here

Put `.gif` files in this folder, then set `type` to `"gif"` in `data/demos.json`:

```json
{
  "id": "agent-monitoring",
  "type": "gif",
  "src": "assets/gifs/agent-monitoring.gif",
  "thumbnail": "assets/thumbnails/agent-monitoring.jpg"
}
```

Tips:
- GIFs autoplay and loop with no controls — best for short, silent UI captures (10–20s).
- Keep them under ~8 MB; GIFs are heavy. For anything longer, prefer an MP4.
- The `thumbnail` is optional; the GIF itself is shown in the modal.

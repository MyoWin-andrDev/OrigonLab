# Images

## Project imagery — `public/work/`

Drop a file here, then reference it in `data/projects.ts`:

```ts
{
  slug: "meridian-commerce",
  image: "/work/meridian.jpg",
  imageAlt: "Meridian storefront and checkout",
  ...
}
```

Until `image` is set, the card renders a **context mockup** — a wireframe
browser (for `category: "website"`) or phone (for `"mobile"`) on the project's
gradient. That is intentional: it shows what kind of build it is without
pretending to be a screenshot of work that hasn't been photographed.

**Recommended:** 1200×1500 (4:5), JPG or WebP, under ~300KB.

### Figma thumbnails
Figma's API returns **signed URLs that expire within hours** — linking one
directly will 404 the same day. Export the frame from Figma and commit the file
here instead. `next.config.mjs` allows Figma hosts so you can preview while
working, but don't ship a signed URL.

## Team portraits — `public/team/`

```ts
{ slug: "graphic-designer", image: "/team/alex.jpg", ... }
```

Falls back to the member's initials on their gradient. **Recommended:**
800×1000 (4:5), subject's eyes roughly a third down the frame.

---

## Portrait treatment (already built)

Portraits go through `components/PortraitImage.tsx`. You only supply the file:

```ts
// data/team.ts
{ slug: "graphic-designer", name: "Charm",
  image: "/team/charm.png",
  pixelArt: true,        // sprite art — omit for photographs
  ... }
```

**What it does automatically**

- **Duotone.** The image composites over that member's gradient with
  `mix-blend-mode: luminosity` — the portrait gives lightness, the gradient
  gives colour. Four unrelated source images still read as one set, and each
  tile stays in its own palette. No per-image colour work needed.
- **Contrast lift** (`contrast 1.14 / brightness 1.04`) so the duotone doesn't
  go flat in the midtones.
- **Grain** matching the rest of the page.
- **Vignette** so the name and properties always have ground to sit on.
- **Hover scale** inherited from the tile.

**`pixelArt: true`** turns off Next's image optimisation (`unoptimized`) and
switches to `image-rendering: pixelated`. Sprite work run through a normal
resize comes back smoothed into mush — this keeps the hard edges.

Leave `image` unset and the tile falls back to the monogram. Both paths are
live, so you can fill people in one at a time.

**Sizes:** photos 800×1000 (4:5). Pixel art can be much smaller — 48×60
upscaled nearest-neighbour is plenty, since it is not being resampled.

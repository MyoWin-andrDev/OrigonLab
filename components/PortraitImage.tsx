import Image from "next/image";

/**
 * Portrait treatment for team tiles.
 *
 * The image is composited with `mix-blend-mode: luminosity` over the member's
 * gradient: the photo supplies lightness, the gradient supplies hue and
 * saturation. That produces a true duotone with no SVG filters, and — the
 * reason it's done this way — every portrait is automatically tinted into its
 * own tile's palette, so four unrelated source images still read as one set.
 *
 * `pixelArt` switches off Next's resampling and turns on nearest-neighbour
 * upscaling. Sprite work run through a normal optimisation pass comes back
 * smoothed into mush, which is the opposite of the point.
 */

interface PortraitImageProps {
  src: string;
  alt: string;
  /** Tailwind gradient classes — supplies the duotone's colour. */
  gradientFrom: string;
  gradientTo: string;
  /** Preserve hard pixel edges and skip optimisation. */
  pixelArt?: boolean;
  /** Skip the duotone and show the artwork's own colours. */
  fullColour?: boolean;
  sizes: string;
  /** Applied to the scaling wrapper, e.g. the group-hover scale. */
  className?: string;
  priority?: boolean;
}

export default function PortraitImage({
  src,
  alt,
  gradientFrom,
  gradientTo,
  pixelArt = false,
  fullColour = false,
  sizes,
  className = "",
  priority = false,
}: PortraitImageProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Colour bed — the duotone's hue comes from here */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo}`}
      />

      {/* Portrait, contributing luminance only */}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        // Nearest-neighbour source: let the browser scale it, not the optimiser.
        unoptimized={pixelArt}
        quality={pixelArt ? 100 : 82}
        className="object-cover"
        style={{
          // fullColour drops the blend so the art keeps its own palette;
          // the gradient beneath then only shows through transparency.
          mixBlendMode: fullColour ? "normal" : "luminosity",
          imageRendering: pixelArt ? "pixelated" : "auto",
          // Pushes the midtones apart so the duotone doesn't read flat.
          filter: fullColour ? "none" : "contrast(1.14) brightness(1.04)",
        }}
      />

      {/* Grain, tying the portrait to the rest of the page */}
      {!fullColour && <div aria-hidden className="portrait-grain absolute inset-0" />}

      {/* Slight vignette so the tile's text always has ground to sit on */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 50% 35%, transparent 45%, rgba(0,0,0,0.34) 100%)",
        }}
      />
    </div>
  );
}

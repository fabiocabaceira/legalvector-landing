export interface Filme {
  src720: string;
  src1080?: string;
  poster: string;
  vtt: string;
  label: string;
  seconds: number;
  /** Seconds to skip at the start of the file (a black or unrelated lead-in). Every restart goes here, not to 0. */
  inicio?: number;
  /** The captions are burned into the picture: no caption bar over the frame, only the one under it on phones. */
  legendasQueimadas?: boolean;
}

// The hero film. A new film replaces this record and nothing else (16:9, 25 to 55 s, WebP poster, .vtt).
export const HERO_FILM: Filme = {
  src720: "campaign/film/live-front-door.mp4",
  poster: "campaign/film/live-front-door.webp",
  vtt: "campaign/film/live-front-door.vtt",
  label: "legalVector, the desk for your Legal team, real product, 39 seconds",
  seconds: 38.7,
  legendasQueimadas: true,
};

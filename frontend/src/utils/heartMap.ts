import type { Side } from "../context/AuthContext";

export type HeartTile = {
  id: string;
  x: number;
  y: number;
  side: Side;
};

export const heartMap: HeartTile[] = [
  // Верхние ушки
  { id: "T1", x: 2, y: 0, side: "left" as Side },
  { id: "T2", x: 3, y: 0, side: "left" as Side },
  { id: "T3", x: 5, y: 0, side: "right" as Side },
  { id: "T4", x: 6, y: 0, side: "right" as Side },

  // Ряд 1
  { id: "T5", x: 1, y: 1, side: "left" as Side },
  { id: "T6", x: 2, y: 1, side: "left" as Side },
  { id: "T7", x: 3, y: 1, side: "left" as Side },
  { id: "T8", x: 4, y: 1, side: "center" as Side },
  { id: "T9", x: 5, y: 1, side: "right" as Side },
  { id: "T10", x: 6, y: 1, side: "right" as Side },
  { id: "T11", x: 7, y: 1, side: "right" as Side },

  // Ряд 2 — широкая часть сердца
  ...Array.from({ length: 9 }).map((_, i) => ({
    id: `R2_${i}`,
    x: i,
    y: 2,
    side: i < 4 ? ("left" as Side) : i === 4 ? ("center" as Side) : ("right" as Side)
  })),

  // Ряд 3 — широкая часть
  ...Array.from({ length: 9 }).map((_, i) => ({
    id: `R3_${i}`,
    x: i,
    y: 3,
    side: i < 4 ? ("left" as Side) : i === 4 ? ("center" as Side) : ("right" as Side)
  })),

  // Центр 2×2
  { id: "C1", x: 3, y: 3, side: "center" as Side },
  { id: "C2", x: 4, y: 3, side: "center" as Side },
  { id: "C3", x: 3, y: 4, side: "center" as Side },
  { id: "C4", x: 4, y: 4, side: "center" as Side },

  // Ряд 4 — сужение
  ...Array.from({ length: 7 }).map((_, i) => ({
    id: `R4_${i}`,
    x: i + 1,
    y: 4,
    side: i < 3 ? ("left" as Side) : i === 3 ? ("center" as Side) : ("right" as Side)
  })),

  // Ряд 5 — ещё сужение
  ...Array.from({ length: 5 }).map((_, i) => ({
    id: `R5_${i}`,
    x: i + 2,
    y: 5,
    side: i < 2 ? ("left" as Side) : i === 2 ? ("center" as Side) : ("right" as Side)
  })),

  // Ряд 6
  ...Array.from({ length: 3 }).map((_, i) => ({
    id: `R6_${i}`,
    x: i + 3,
    y: 6,
    side: i === 0 ? ("left" as Side) : i === 1 ? ("center" as Side) : ("right" as Side)
  })),

  // Ряд 7 — нижняя точка
  { id: "B1", x: 4, y: 7, side: "center" as Side }
];



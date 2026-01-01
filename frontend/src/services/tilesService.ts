import {
  collection,
  doc,
  getDocs,
  query,
  setDoc
} from "firebase/firestore";
import { db } from "./firebase";
import type { Side } from "../context/AuthContext";
import type { HeartTile } from "../utils/heartMap";

// ----------------------
// GitHub Upload Service
// ----------------------

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = (reader.result as string).split(",")[1];
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function uploadToGitHub(file: File, tileId: string, userId: string) {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  const repo = import.meta.env.VITE_GITHUB_REPO;
  const user = import.meta.env.VITE_GITHUB_USER;

  if (!token || !repo || !user) {
    throw new Error("GitHub env variables are missing");
  }

  const base64 = await fileToBase64(file);

  // путь внутри репозитория
  const path = `public/uploads/${tileId}-${userId}.jpg`;

  const url = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;

  const body = {
    message: `Upload tile ${tileId} by ${userId}`,
    content: base64
  };

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub upload failed: ${text}`);
  }

  const json = await res.json();
  return json.content.download_url;
}

// ----------------------
// Firestore Tile Service
// ----------------------

export type TileData = {
  id: string;
  x: number;
  y: number;
  side: Side;
  photoURL: string | null;
  userId: string | null;
};

const TILES_COLLECTION = "tiles";

export async function getAllTiles(): Promise<TileData[]> {
  const q = query(collection(db, TILES_COLLECTION));
  const snap = await getDocs(q);
  const result: TileData[] = [];
  snap.forEach(docSnap => {
    result.push(docSnap.data() as TileData);
  });
  return result;
}

export async function initTilesFromHeartMap(heartMap: HeartTile[]) {
  const q = query(collection(db, TILES_COLLECTION));
  const snap = await getDocs(q);
  if (!snap.empty) return;

  const writes = heartMap.map(tile => {
    const refDoc = doc(db, TILES_COLLECTION, tile.id);
    const data: TileData = {
      id: tile.id,
      x: tile.x,
      y: tile.y,
      side: tile.side,
      photoURL: null,
      userId: null
    };
    return setDoc(refDoc, data);
  });

  await Promise.all(writes);
}

export async function uploadTilePhoto(
  tileId: string,
  file: File,
  userId: string
): Promise<string> {
  // 1. Загружаем фото в GitHub
  const url = await uploadToGitHub(file, tileId, userId);

  // 2. Обновляем Firestore
  const refDoc = doc(db, TILES_COLLECTION, tileId);
  await setDoc(
    refDoc,
    {
      photoURL: url,
      userId
    },
    { merge: true }
  );

  return url;
}

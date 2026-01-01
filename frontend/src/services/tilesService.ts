import {
  collection,
  doc,
  getDocs,
  query,
  setDoc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";
import type { Side } from "../context/AuthContext";
import type { HeartTile } from "../utils/heartMap";

export type TileData = {
  id: string;
  x: number;
  y: number;
  side: Side; // теперь Side включает "center"
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
  const storageRef = ref(storage, `tiles/${tileId}/${userId}-${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

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

import { useEffect, useState, ChangeEvent } from "react";
import "./HeartGrid.css";
import { heartMap } from "../../utils/heartMap";
import { useAuth } from "../../context/AuthContext";
import {
  getAllTiles,
  initTilesFromHeartMap,
  uploadTilePhoto,
  type TileData
} from "../../services/tilesService";

export default function HeartGrid() {
  const { userData, logout } = useAuth();
  const [tiles, setTiles] = useState<TileData[] | null>(null);
  const [uploadingTileId, setUploadingTileId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userData) return;

    const load = async () => {
      try {
        setError(null);
        await initTilesFromHeartMap(heartMap);
        const loaded = await getAllTiles();
        setTiles(loaded);
      } catch (e: any) {
        setError(e.message ?? "Ошибка загрузки тайлов");
      }
    };

    void load();
  }, [userData]);

  if (!userData) {
    return <p>Нет данных пользователя</p>;
  }

  if (!tiles) {
    return <p style={{ textAlign: "center", marginTop: 40 }}>Загружаем сердце...</p>;
  }

  const handleFileChange =
    (tileId: string) => async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !userData) return;

      try {
        setUploadingTileId(tileId);
        const url = await uploadTilePhoto(tileId, file, userData.uid);
        setTiles(prev =>
          prev
            ? prev.map(t => (t.id === tileId ? { ...t, photoURL: url, userId: userData.uid } : t))
            : prev
        );
      } catch (e: any) {
        setError(e.message ?? "Ошибка загрузки фото");
      } finally {
        setUploadingTileId(null);
        e.target.value = "";
      }
    };

  return (
    <div className="heart-page">
      <header className="heart-header">
        <div>
          <div className="logo">coreDUO</div>
          <div className="subtitle">
            Твоя сторона: <b>{userData.side === "left" ? "левая" : "правая"}</b>
          </div>
        </div>
        <button className="logout-btn" onClick={logout}>
          Выйти
        </button>
      </header>

      {error && <div className="error">{error}</div>}

      <div className="heart-grid">
        {tiles.map(tile => {
          const isMySide = tile.side === userData.side;
          const isCenter = tile.side === "center";
          const hasPhoto = !!tile.photoURL;
          const isUploading = uploadingTileId === tile.id;

          return (
            <label
              key={tile.id}
              className={`tile 
                ${isCenter ? "center-tile" : ""}
                ${isMySide ? "my-side" : "other-side"} 
                ${hasPhoto ? "with-photo" : "empty"}
              `}
              style={{
                gridColumn: tile.x + 1,
                gridRow: tile.y + 1
              }}
            >
              {hasPhoto ? (
                <img src={tile.photoURL!} alt="tile" className="tile-img" />
              ) : (
                <span className="tile-placeholder">
                  {isCenter ? "❤️" : isMySide ? "💖" : "✨"}
                </span>
              )}

              {isMySide && !isCenter && (
                <input
                  type="file"
                  accept="image/*"
                  className="file-input"
                  onChange={handleFileChange(tile.id)}
                  disabled={isUploading}
                />
              )}

              {isUploading && <div className="tile-uploading">Загрузка...</div>}
            </label>
          );
        })}
      </div>
    </div>
  );
}




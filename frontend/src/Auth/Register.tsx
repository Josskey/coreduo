import { FormEvent, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./../services/firebase";
import { useAuth } from "./../context/AuthContext";
import { Button } from "../UI/Button";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export function Register() {
  const { setUserData } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [side, setSide] = useState<"left" | "right">("left");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // создаём пользователя в Firebase Auth
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const uid = res.user.uid;

      // сохраняем сторону в Firestore
      await setDoc(doc(db, "users", uid), {
        side
      });

      // кладём данные в AuthContext
      setUserData({
        uid,
        side
      });

      // 🔥 редирект после успешной регистрации
      navigate("/heart");

    } catch (err: any) {
      setError(err.message ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 320, margin: "40px auto" }}>
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Пароль
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </label>
        </div>

        <div>
          <span>Твоя сторона сердца:</span>
          <label>
            <input
              type="radio"
              value="left"
              checked={side === "left"}
              onChange={() => setSide("left")}
            />
            Левая
          </label>
          <label>
            <input
              type="radio"
              value="right"
              checked={side === "right"}
              onChange={() => setSide("right")}
            />
            Правая
          </label>
        </div>

        {error && (
          <div style={{ color: "red", marginTop: 8 }}>
            {error}
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <Button type="submit" disabled={loading}>
            {loading ? "Создаём..." : "Зарегистрироваться"}
          </Button>
        </div>
      </form>
    </div>
  );
}


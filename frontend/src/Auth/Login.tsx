import { FormEvent, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./../services/firebase";
import { useAuth } from "./../context/AuthContext";
import { Button } from "../UI/Button";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export function Login() {
  const { setUserData } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const uid = res.user.uid;

      const snap = await getDoc(doc(db, "users", uid));

      if (!snap.exists()) {
        setError("Профиль пользователя не найден");
        return;
      }

      const data = snap.data();

      setUserData({
        uid,
        side: data.side
      });

      navigate("/heart");
    } catch (err: any) {
      setError(err.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 320, margin: "40px auto" }}>
      <h2>Вход</h2>
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

        {error && (
          <div style={{ color: "red", marginTop: 8 }}>
            {error}
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <Button type="submit" disabled={loading}>
            {loading ? "Входим..." : "Войти"}
          </Button>
        </div>
      </form>
    </div>
  );
}


import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Login } from "../src/Auth/Login";
import { Register } from "../src/Auth/Register";
import HeartGrid from "./components/HeartGrid/HeartGrid";
import { BrowserRouter } from "react-router-dom";

function AppInner() {
  const { isAuthenticated } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: 360, margin: "40px auto" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <button onClick={() => setMode("login")}>Вход</button>
          <button onClick={() => setMode("register")} style={{ marginLeft: 8 }}>
            Регистрация
          </button>
        </div>
        {mode === "login" ? <Login /> : <Register />}
      </div>
    );
  }

  return <HeartGrid />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </BrowserRouter>
  );
}

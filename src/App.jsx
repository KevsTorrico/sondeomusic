import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import LoginPage from "./components/Login/LoginPage";
import Dashboard from "./components/menu/Dashboard";

export default function App() {
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    // Sesión actual al cargar la app
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoadingSession(false);
    });

    // Escucha cambios de sesión (login, logout, token refresh)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogin = async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: mapAuthError(error.message) };
    }
    // Éxito: onAuthStateChange actualiza "session" solo
    return {};
  };

  function mapAuthError(message) {
    if (message.includes("Invalid login credentials")) {
      return "Correo o contraseña incorrectos.";
    }
    return "No pudimos iniciar tu sesión. Intenta de nuevo.";
  }

  if (loadingSession) return null; // o un spinner

  return session ? (
    <Dashboard onLogout={() => supabase.auth.signOut()} />
  ) : (
    <LoginPage onSubmit={handleLogin} />
  );
}
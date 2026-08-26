import LoginPage from "./components/Login/LoginPage";

export default function App() {
  // Reemplaza esto con tu llamada real a la API / auth provider
  const handleLogin = async ({ email, password, remember }) => {
    console.log("Intentando iniciar sesión con:", { email, password, remember });

    // Ejemplo de integración real:
    // const res = await fetch("/api/login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email, password }),
    // });
    // if (!res.ok) return { error: "Correo o contraseña incorrectos." };
  };

  return <LoginPage onSubmit={handleLogin} />;
}

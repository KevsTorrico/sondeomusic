import { useState } from "react";
import logoIcon from "../../assets/logo-mixer.jpeg";
import "./LoginPage.css";

export default function LoginPage({ onSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Completa tu correo y contraseña para continuar.");
      return;
    }

    setLoading(true);

    try {
      if (onSubmit) {
        const result = await onSubmit({
          email: email.trim(),
          password,
          remember,
        });

        if (result?.error) {
          setError(result.error);
        }
      } else {
        // Comportamiento de ejemplo
        await new Promise((resolve) => setTimeout(resolve, 900));

        console.log("Login de ejemplo:", {
          email: email.trim(),
          password,
          remember,
        });
      }
    } catch (err) {
      setError(
        err?.message ||
          "No pudimos iniciar tu sesión. Intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* =================================
          PANEL DE PRESENTACIÓN
      ================================= */}

      <section className="login-showcase">
        <div className="showcase-content">

          <h1 className="showcase-title">
            SONDEO
            <br />
            <em>music</em>
          </h1>

          <img
            src={logoIcon}
            alt="Sondeo Music"
            className="showcase-logo"
          />

        </div>
      </section>


      {/* =================================
          PANEL DE LOGIN
      ================================= */}

      <main className="login-panel">
        <form
          className="login-card"
          onSubmit={handleSubmit}
          noValidate
        >

          <header className="login-header">
            <h2 className="login-title">
              Iniciar sesión
            </h2>

          </header>


          {/* CORREO */}

          <label className="field">
            <span className="field-label">
              Correo electrónico
            </span>

            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </label>


          {/* CONTRASEÑA */}

          <label className="field">
            <span className="field-label">
              Contraseña
            </span>

            <div className="password-wrap">

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />

              <button
                type="button"
                className="toggle-visibility"
                onClick={() =>
                  setShowPassword((visible) => !visible)
                }
                aria-label={
                  showPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
                disabled={loading}
              >
                {showPassword ? (
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 3l18 18M10.6 10.7a2.5 2.5 0 003.5 3.5M6.6 6.7C4.3 8.2 2.7 10.4 2 12c1.4 3.4 5.2 7 10 7 1.8 0 3.4-.5 4.8-1.3M9.9 4.3A10.6 10.6 0 0112 4c4.8 0 8.6 3.6 10 7-.5 1.2-1.3 2.5-2.3 3.6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 12c1.4-3.4 5.2-7 10-7s8.6 3.6 10 7c-1.4 3.4-5.2 7-10 7s-8.6-3.6-10-7z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />

                    <circle
                      cx="12"
                      cy="12"
                      r="2.6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                  </svg>
                )}
              </button>

            </div>
          </label>


          {/* OPCIONES */}

          <div className="field-row">

            <label className="checkbox">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) =>
                  setRemember(e.target.checked)
                }
                disabled={loading}
              />

              <span
                className="checkbox-box"
                aria-hidden="true"
              />

              <span>
                Recordarme
              </span>
            </label>

            <a
              href="#recuperar"
              className="link"
            >
              ¿Olvidaste tu contraseña?
            </a>

          </div>


          {/* ERROR */}

          {error && (
            <p
              className="form-error"
              role="alert"
            >
              {error}
            </p>
          )}


          {/* BOTÓN */}

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>

        </form>
      </main>

    </div>
  );
}
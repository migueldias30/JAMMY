"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Chrome, LogIn, Mail, UserPlus } from "lucide-react";
import styles from "./auth-screen.module.css";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: Record<string, string | number>
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface AuthScreenProps {
  jamsCount: number;
  friendsCount: number;
  groupsCount: number;
  onLogin: (email: string, password: string) => Promise<string | null>;
  onRegister: (name: string, email: string, password: string) => Promise<string | null>;
  onGoogleLogin: (credential: string) => Promise<string | null>;
}

export default function AuthScreen({
  jamsCount,
  friendsCount,
  groupsCount,
  onLogin,
  onRegister,
  onGoogleLogin,
}: AuthScreenProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const stats = useMemo(
    () => [
      { value: jamsCount, label: "Jams" },
      { value: friendsCount, label: "Amigos" },
      { value: groupsCount, label: "Grupos" },
    ],
    [friendsCount, groupsCount, jamsCount]
  );

  useEffect(() => {
    if (!googleClientId) {
      return;
    }

    const existingScript = document.querySelector('script[data-google-identity="true"]');
    if (existingScript) {
      if (window.google?.accounts.id) {
        setGoogleReady(true);
      } else {
        existingScript.addEventListener("load", () => setGoogleReady(true), { once: true });
      }
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.dataset.googleIdentity = "true";
    script.addEventListener("load", () => setGoogleReady(true), { once: true });
    document.head.appendChild(script);
  }, [googleClientId]);

  useEffect(() => {
    if (!googleClientId || !googleReady || !googleButtonRef.current || !window.google?.accounts.id) {
      return;
    }

    googleButtonRef.current.innerHTML = "";

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: async ({ credential }) => {
        const loginError = await onGoogleLogin(credential);
        setError(loginError);
      },
    });

    window.google.accounts.id.renderButton(googleButtonRef.current, {
      theme: "outline",
      size: "large",
      shape: "pill",
      text: "continue_with",
      width: 320,
    });
  }, [googleClientId, googleReady, onGoogleLogin]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result =
      mode === "login"
        ? await onLogin(email.trim(), password)
        : await onRegister(name.trim(), email.trim(), password);

    setError(result);
    setIsSubmitting(false);
  };

  return (
    <div className={styles.screen}>
      <div className={styles.shell}>
        <div className={styles.panel}>
          <section className={styles.hero}>
            <div>
              <p className={styles.brand}>Jammy</p>
            </div>
            <div className="space-y-4">
              <h1 className={styles.headline}>Entra para criar jams, juntar-te aos teus amigos e guardar tudo na base de dados.</h1>
              <p className={styles.copy}>
                O login por email fica persistido na base local da app. O login com Google fica pronto a funcionar assim
                que definires `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.
              </p>
            </div>
            <div className={styles.stats}>
              {stats.map((stat) => (
                <div key={stat.label} className={styles.stat}>
                  <p className={styles.statValue}>{stat.value}</p>
                  <p className={styles.statLabel}>{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.auth}>
            <div>
              <h2 className={styles.title}>{mode === "login" ? "Iniciar Sessao" : "Criar Conta"}</h2>
              <p className={styles.subtitle}>
                {mode === "login"
                  ? "Usa email/password ou Google para entrares."
                  : "Cria a tua conta e fica autenticado automaticamente."}
              </p>
            </div>

            <div className={styles.tabs}>
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`${styles.tab} ${mode === "login" ? styles.tabActive : styles.tabIdle}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`${styles.tab} ${mode === "register" ? styles.tabActive : styles.tabIdle}`}
              >
                Registo
              </button>
            </div>

            <button
              type="button"
              className={styles.googleButton}
              onClick={() => window.google?.accounts.id.prompt()}
              disabled={!googleClientId || !googleReady}
            >
              <Chrome size={18} />
              Continuar com Google
            </button>

            <div ref={googleButtonRef} />

            {!googleClientId && (
              <p className={styles.hint}>Define `NEXT_PUBLIC_GOOGLE_CLIENT_ID` para ativar o login real com Google.</p>
            )}

            {googleClientId && !googleReady && (
              <p className={styles.hint}>A carregar autenticação Google...</p>
            )}

            <div className={styles.divider}>ou</div>

            <form className={styles.form} onSubmit={handleSubmit}>
              {mode === "register" && (
                <div className={styles.field}>
                  <label className={styles.label}>Nome</label>
                  <input
                    className={styles.input}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="O teu nome"
                    required
                  />
                </div>
              )}

              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input
                  className={styles.input}
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="nome@exemplo.com"
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Password</label>
                <input
                  className={styles.input}
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Minimo 6 caracteres"
                  minLength={6}
                  required
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button type="submit" className={styles.button} disabled={isSubmitting}>
                {mode === "login" ? <LogIn size={18} /> : <UserPlus size={18} />}
                {mode === "login" ? "Entrar com Email" : "Criar Conta"}
              </button>
            </form>

            <p className={styles.hint}>
              As credenciais por email e a sessão ficam guardadas na base de dados local da app.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

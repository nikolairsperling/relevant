"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // ✅ Wenn Supabase dich mit ?code=... auf /login zurückschickt:
  // Code -> Session tauschen -> Dashboard
  useEffect(() => {
    const run = async () => {
      const code = searchParams.get("code");
      const err = searchParams.get("error");
      const errDesc = searchParams.get("error_description");

      if (err) {
        setMessage(errDesc ? decodeURIComponent(errDesc) : err);
        return;
      }

      if (code) {
        setMessage("Login wird abgeschlossen...");
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setMessage(`Callback-Fehler: ${error.message}`);
          return;
        }
        router.replace("/dashboard");
      }
    };

    run();
  }, [router, searchParams]);

  const handleLogin = async () => {
    setLoading(true);
    setMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setMessage("Bitte E-Mail eingeben.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        // ✅ Ideal wäre /auth/callback – aber selbst wenn Supabase trotzdem /login nutzt,
        // fängt der Code oben es ab.
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(`Fehler: ${error.message}`);
    } else {
      setMessage("Magic Link wurde versendet. Bitte E-Mail prüfen.");
    }

    setLoading(false);
  };

  return (
    <main style={{ maxWidth: 420, margin: "80px auto", padding: 20 }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Login</h1>

      <label style={{ display: "block", marginBottom: 8 }}>E-Mail</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="name@domain.de"
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 8,
          border: "1px solid #333",
          background: "transparent",
          color: "inherit",
        }}
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          marginTop: 12,
          padding: "10px 14px",
          borderRadius: 8,
          border: "1px solid #333",
          cursor: "pointer",
          width: "100%",
        }}
      >
        {loading ? "Sende..." : "Magic Link senden"}
      </button>

      {message && <p style={{ marginTop: 12 }}>{message}</p>}
    </main>
  );
}


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login");
        return;
      }
      setEmail(data.session.user.email ?? "");
    };
    run();
  }, [router]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Dashboard</h1>
      <p style={{ opacity: 0.8, marginBottom: 24 }}>
        Eingeloggt als: <b>{email || "…"}</b>
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 16,
        }}
      >
        <div style={{ padding: 16, border: "1px solid #222", borderRadius: 
12 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Status</div>
          <div style={{ opacity: 0.8 }}>Login & Session laufen.</div>
        </div>

        <div style={{ padding: 16, border: "1px solid #222", borderRadius: 
12 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Nächster 
Schritt</div>
          <div style={{ opacity: 0.8 }}>Profile + RLS + Daten.</div>
        </div>

        <div style={{ padding: 16, border: "1px solid #222", borderRadius: 
12 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Aktionen</div>
          <button onClick={logout} style={{ marginTop: 8 }}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}


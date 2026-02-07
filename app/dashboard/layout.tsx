export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
      <aside
        style={{
          width: 240,
          padding: 16,
          borderRight: "1px solid #222",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 16 }}>Tasklytic</div>

        <nav style={{ display: "grid", gap: 8 }}>
          <a href="/dashboard">Übersicht</a>
          <a href="/dashboard/profile">Profil</a>
          <a href="/dashboard/settings">Einstellungen</a>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 24 }}>{children}</main>
    </div>
  );
}


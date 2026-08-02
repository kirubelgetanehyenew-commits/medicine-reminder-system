import Sidebar from "./Sidebar";

/**
 * Shell for all authenticated pages.
 * Sidebar on the left, scrollable content on the right.
 * No topnav — the sidebar IS the navigation.
 */
function AppLayout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-page)" }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          minWidth: 0,
          overflowY: "auto",
          padding: "32px 36px 60px",
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default AppLayout;

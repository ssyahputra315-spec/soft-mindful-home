import { Outlet, Link, createRootRoute, HeadContent, Scripts, useLocation } from "@tanstack/react-router";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-light text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-medium">Page not found</h2>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-primary px-6 py-2.5 text-primary-foreground">
          Return Home
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" },
      { name: "theme-color", content: "#F5F1E8" },
      { title: "Dhamma Reflection — Mindful Companion" },
      { name: "description", content: "A calm offline companion for daily Dhamma quotes, mood tracking, journaling and meditation." },
      { property: "og:title", content: "Dhamma Reflection — Mindful Companion" },
      { name: "twitter:title", content: "Dhamma Reflection — Mindful Companion" },
      { property: "og:description", content: "A calm offline companion for daily Dhamma quotes, mood tracking, journaling and meditation." },
      { name: "twitter:description", content: "A calm offline companion for daily Dhamma quotes, mood tracking, journaling and meditation." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c6a546e4-3b3e-4ae3-bfcb-b60b35f8127f/id-preview-6901e8a6--a71eec6c-fa2e-4deb-baca-42d34ff6d864.lovable.app-1776501428223.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c6a546e4-3b3e-4ae3-bfcb-b60b35f8127f/id-preview-6901e8a6--a71eec6c-fa2e-4deb-baca-42d34ff6d864.lovable.app-1776501428223.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

const TABS = [
  { to: "/", label: "Today", icon: "☀️" },
  { to: "/journal", label: "Journal", icon: "📔" },
  { to: "/meditate", label: "Meditate", icon: "🧘" },
  { to: "/insights", label: "Insights", icon: "📊" },
] as const;

function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {TABS.map((t) => {
          const active = t.to === "/" ? pathname === "/" : pathname.startsWith(t.to);
          return (
            <Link
              key={t.to}
              to={t.to}
              className="flex flex-1 flex-col items-center gap-0.5 py-2.5 transition-transform active:scale-95"
            >
              <span className={`text-xl transition-opacity ${active ? "opacity-100" : "opacity-50"}`}>{t.icon}</span>
              <span className={`text-[10px] font-medium tracking-wide ${active ? "text-primary" : "text-muted-foreground"}`}>
                {t.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function RootComponent() {
  const { pathname } = useLocation();
  const hideNav = pathname.startsWith("/journal/new") || pathname.startsWith("/meditate/session");
  return (
    <div className="min-h-screen bg-background">
      <main className={`mx-auto max-w-md px-5 pt-6 ${hideNav ? "pb-6" : "pb-24"} animate-fade-in`} key={pathname}>
        <Outlet />
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}

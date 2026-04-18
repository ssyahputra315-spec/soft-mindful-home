import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/meditate/")({
  head: () => ({
    meta: [
      { title: "Meditate — Dhamma Reflection" },
      { name: "description", content: "Calm meditation timer." },
    ],
  }),
  component: MeditatePage,
});

const PRESETS = [5, 10, 15, 20];

function MeditatePage() {
  const [selected, setSelected] = useState(10);

  return (
    <div className="space-y-6">
      <header className="pt-2 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Practice</p>
        <h1 className="mt-1 text-2xl font-light">Meditate</h1>
      </header>

      <div className="flex justify-center py-6">
        <div className="relative flex h-56 w-56 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-breathe" />
          <div className="absolute inset-6 rounded-full bg-primary/15" />
          <div className="absolute inset-12 rounded-full bg-card shadow-[var(--shadow-soft)]" />
          <div className="relative text-center">
            <div className="text-5xl font-light text-foreground">{selected}</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">minutes</div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-card p-5 shadow-[var(--shadow-card)]">
        <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Choose duration</p>
        <div className="grid grid-cols-4 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => setSelected(p)}
              className={`rounded-2xl py-3 text-sm font-medium transition-all active:scale-95 ${
                selected === p ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
              }`}
            >
              {p} min
            </button>
          ))}
        </div>
      </div>

      <Link
        to="/meditate/session"
        search={{ duration: selected }}
        className="block w-full rounded-full bg-primary py-4 text-center font-medium text-primary-foreground transition-transform active:scale-95"
      >
        Begin
      </Link>
    </div>
  );
}

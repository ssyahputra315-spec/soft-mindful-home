import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadData, moodEmoji, type JournalEntry } from "@/lib/storage";

export const Route = createFileRoute("/journal/")({
  head: () => ({
    meta: [
      { title: "Journal — Dhamma Reflection" },
      { name: "description", content: "Your reflections, gratitude and acts of kindness." },
    ],
  }),
  component: JournalList,
});

function JournalList() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const data = loadData();
    setEntries([...data.journalEntries].sort((a, b) => b.date.localeCompare(a.date)));
  }, []);

  return (
    <div className="space-y-5">
      <header className="pt-2 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Reflections</p>
          <h1 className="mt-1 text-2xl font-light">Journal</h1>
        </div>
        <span className="text-sm text-muted-foreground">{entries.length} {entries.length === 1 ? "entry" : "entries"}</span>
      </header>

      {entries.length === 0 ? (
        <div className="rounded-3xl bg-card p-10 text-center shadow-[var(--shadow-card)]">
          <div className="text-5xl">🪷</div>
          <p className="mt-4 text-foreground font-light">Your journal is a quiet space.</p>
          <p className="mt-1 text-sm text-muted-foreground">Begin with one gentle thought.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {entries.map((e) => (
            <li key={e.id}>
              <Link
                to="/journal/$id"
                params={{ id: e.id }}
                className="block rounded-2xl bg-card p-5 shadow-[var(--shadow-card)] transition-transform active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {new Date(e.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <span className="text-xl">{moodEmoji(e.mood)}</span>
                </div>
                <p className="mt-2 text-sm text-foreground line-clamp-2 font-light">
                  {e.reflection.slice(0, 80)}{e.reflection.length > 80 ? "…" : ""}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link
        to="/journal/new"
        className="fixed bottom-24 right-1/2 z-30 translate-x-[calc(11rem)] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl text-primary-foreground shadow-[var(--shadow-soft)] transition-transform active:scale-90"
        aria-label="New reflection"
      >
        +
      </Link>
    </div>
  );
}

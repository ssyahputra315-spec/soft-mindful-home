import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadData, saveData, moodEmoji, type JournalEntry } from "@/lib/storage";

export const Route = createFileRoute("/journal/$id")({
  head: () => ({ meta: [{ title: "Reflection — Dhamma Reflection" }] }),
  component: EntryPage,
  notFoundComponent: () => (
    <div className="py-20 text-center">
      <p className="text-muted-foreground">Reflection not found.</p>
      <Link to="/journal" className="mt-4 inline-block text-primary">Back to Journal</Link>
    </div>
  ),
});

function EntryPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    const data = loadData();
    setEntry(data.journalEntries.find((e) => e.id === id) ?? null);
  }, [id]);

  const remove = () => {
    if (!confirm("Delete this reflection?")) return;
    const data = loadData();
    data.journalEntries = data.journalEntries.filter((e) => e.id !== id);
    saveData(data);
    navigate({ to: "/journal" });
  };

  if (!entry) {
    return <div className="py-20 text-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="space-y-5 pb-8">
      <header className="flex items-center justify-between pt-2">
        <button
          onClick={() => navigate({ to: "/journal" })}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-lg shadow-[var(--shadow-card)] active:scale-90"
        >
          ←
        </button>
        <span className="text-2xl">{moodEmoji(entry.mood)}</span>
        <button
          onClick={remove}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-sm shadow-[var(--shadow-card)] active:scale-90"
          aria-label="Delete"
        >
          🗑️
        </button>
      </header>

      <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {new Date(entry.date).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
      </p>

      <Block label="Reflection" value={entry.reflection} />
      {entry.gratitude && <Block label="Grateful for" value={entry.gratitude} />}
      {entry.kindness && <Block label="Act of kindness" value={entry.kindness} />}
      {entry.lettingGo && <Block label="Letting go of" value={entry.lettingGo} />}
    </div>
  );
}

function Block({ label, value }: { label: string; value: string }) {
  return (
    <section className="rounded-3xl bg-card p-6 shadow-[var(--shadow-card)]">
      <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground font-light">{value}</p>
    </section>
  );
}

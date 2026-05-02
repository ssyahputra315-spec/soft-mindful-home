import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { loadData, saveData, MOODS, type Mood } from "@/lib/storage";

export const Route = createFileRoute("/journal/new")({
  component: NewReflection,
});

function NewReflection() {
  const navigate = useNavigate();
  const [mood, setMood] = useState<Mood>("calm");
  const [reflection, setReflection] = useState("");
  const [gratitude, setGratitude] = useState("");
  const [kindness, setKindness] = useState("");
  const [lettingGo, setLettingGo] = useState("");

  const save = () => {
    const data = loadData();
    data.journalEntries.push({
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      mood,
      reflection: reflection.trim(),
      gratitude: gratitude.trim(),
      kindness: kindness.trim(),
      lettingGo: lettingGo.trim(),
    });
    saveData(data);
    navigate({ to: "/journal" });
  };

  const canSave = reflection.trim().length > 0;

  return (
    <div className="space-y-5 pb-8">
      <header className="flex items-center justify-between pt-2">
        <button
          onClick={() => navigate({ to: "/journal" })}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-lg shadow-[var(--shadow-card)] active:scale-90"
        >
          ←
        </button>
        <h1 className="text-base font-medium">New Reflection</h1>
        <div className="w-10" />
      </header>

      <section className="rounded-3xl bg-card p-5 shadow-[var(--shadow-card)]">
        <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Mood</p>
        <div className="flex justify-between gap-1">
          {MOODS.map((m) => (
            <button
              key={m.value}
              onClick={() => setMood(m.value)}
              className={`flex flex-1 flex-col items-center gap-1 rounded-2xl py-2.5 transition-all active:scale-90 ${
                mood === m.value ? "bg-primary/15 ring-2 ring-primary" : "bg-secondary/50"
              }`}
            >
              <span className="text-2xl">{m.emoji}</span>
            </button>
          ))}
        </div>
      </section>

      <Field label="Reflection" multiline value={reflection} onChange={setReflection} placeholder="What is alive in you today?" />
      <Field label="One thing you are grateful for" value={gratitude} onChange={setGratitude} placeholder="A small light…" />
      <Field label="One act of kindness you did" value={kindness} onChange={setKindness} placeholder="A gentle gesture…" />
      <Field label="Something you are letting go of" value={lettingGo} onChange={setLettingGo} placeholder="Release it softly…" />

      <button
        onClick={save}
        disabled={!canSave}
        className="w-full rounded-full bg-primary py-3.5 font-medium text-primary-foreground transition-transform active:scale-95 disabled:opacity-40"
      >
        Save Reflection
      </button>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, multiline,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean }) {
  return (
    <section className="rounded-3xl bg-card p-5 shadow-[var(--shadow-card)]">
      <label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={6}
          className="w-full resize-none bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground/60 font-light"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground/60 font-light"
        />
      )}
    </section>
  );
}

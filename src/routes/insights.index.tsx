import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadData, MOODS, type AppData } from "@/lib/storage";

export const Route = createFileRoute("/insights/")({
  component: InsightsPage,
});

function calculateStreak(data: AppData) {
  const days = new Set<string>();
  data.journalEntries.forEach((e) => days.add(e.date.slice(0, 10)));
  data.dailyMood.forEach((m) => days.add(m.date));
  let streak = 0;
  const d = new Date();
  for (;;) {
    const key = d.toISOString().slice(0, 10);
    if (days.has(key)) { streak++; d.setDate(d.getDate() - 1); }
    else break;
  }
  return streak;
}

function InsightsPage() {
  const [data, setData] = useState<AppData | null>(null);
  useEffect(() => { setData(loadData()); }, []);
  if (!data) return null;

  const streak = calculateStreak(data);
  const totalMinutes = data.meditationSessions.reduce((s, x) => s + x.duration, 0);
  const kindnessCount = data.journalEntries.filter((e) => e.kindness.trim().length > 0).length;
  const gratitudeCount = data.journalEntries.filter((e) => e.gratitude.trim().length > 0).length;
  const moodCounts = MOODS.map((m) => ({
    ...m,
    count: data.dailyMood.filter((x) => x.mood === m.value).length,
  }));
  const maxMood = Math.max(1, ...moodCounts.map((m) => m.count));

  return (
    <div className="space-y-5">
      <header className="pt-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Reflection</p>
        <h1 className="mt-1 text-2xl font-light">Insights</h1>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <StatCard icon="🔥" label="Day streak" value={streak} accent="gold" />
        <StatCard icon="🧘" label="Minutes" value={totalMinutes} />
        <StatCard icon="❤️" label="Kindness" value={kindnessCount} />
        <StatCard icon="🌱" label="Gratitude" value={gratitudeCount} accent="gold" />
      </div>

      <section className="rounded-3xl bg-card p-6 shadow-[var(--shadow-card)]">
        <h2 className="text-base font-medium">Mood patterns</h2>
        <div className="mt-4 space-y-3">
          {moodCounts.map((m) => (
            <div key={m.value} className="flex items-center gap-3">
              <span className="w-7 text-xl">{m.emoji}</span>
              <div className="flex-1">
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${(m.count / maxMood) * 100}%` }}
                  />
                </div>
              </div>
              <span className="w-6 text-right text-sm tabular-nums text-muted-foreground">{m.count}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-card p-6 shadow-[var(--shadow-card)]">
        <h2 className="text-base font-medium">Practice</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <Row k="Reflections written" v={data.journalEntries.length} />
          <Row k="Meditation sessions" v={data.meditationSessions.length} />
          <Row k="Favorite quotes" v={data.favoriteQuotes.length} />
          <Row k="Mood check-ins" v={data.dailyMood.length} />
        </dl>
      </section>

      {data.favoriteQuotes.length > 0 && (
        <section className="rounded-3xl bg-card p-6 shadow-[var(--shadow-card)]">
          <h2 className="text-base font-medium">Favorite quotes</h2>
          <ul className="mt-3 space-y-3">
            {data.favoriteQuotes.slice(0, 5).map((q, i) => (
              <li key={i} className="border-l-2 border-gold pl-3 text-sm font-light text-foreground">
                {q}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, accent }: { icon: string; label: string; value: number; accent?: "gold" }) {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-[var(--shadow-card)] animate-scale-in">
      <div className="text-2xl">{icon}</div>
      <div className={`mt-2 text-3xl font-light tabular-nums ${accent === "gold" ? "text-gold" : "text-primary"}`}>
        {value}
      </div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: number }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-medium tabular-nums">{v}</dd>
    </div>
  );
}

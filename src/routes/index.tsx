import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadData, saveData, todayKey, MOODS, type Mood } from "@/lib/storage";
import { QUOTES } from "@/lib/quotes";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Today — Dhamma Reflection" },
      { name: "description", content: "Daily Dhamma quote, mood check-in and reflection." },
    ],
  }),
  component: TodayPage,
});

function pickQuote(seedDate: string) {
  let h = 0;
  for (let i = 0; i < seedDate.length; i++) h = (h * 31 + seedDate.charCodeAt(i)) >>> 0;
  return QUOTES[h % QUOTES.length];
}

function TodayPage() {
  const [quote, setQuote] = useState<string>("");
  const [isFav, setIsFav] = useState(false);
  const [mood, setMood] = useState<Mood | null>(null);
  const [mindfulness, setMindfulness] = useState(3);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const data = loadData();
    const today = todayKey();
    const q = data.dailyQuote?.date === today ? data.dailyQuote.quote : pickQuote(today);
    if (data.dailyQuote?.date !== today) {
      data.dailyQuote = { date: today, quote: q };
      saveData(data);
    }
    setQuote(q);
    setIsFav(data.favoriteQuotes.includes(q));
    const todayMood = data.dailyMood.find((m) => m.date === today);
    if (todayMood) {
      setMood(todayMood.mood);
      setMindfulness(todayMood.mindfulnessLevel);
      setSaved(true);
    }
  }, []);

  const newQuote = () => {
    const next = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setQuote(next);
    const data = loadData();
    data.dailyQuote = { date: todayKey(), quote: next };
    saveData(data);
    setIsFav(data.favoriteQuotes.includes(next));
  };

  const toggleFav = () => {
    const data = loadData();
    if (data.favoriteQuotes.includes(quote)) {
      data.favoriteQuotes = data.favoriteQuotes.filter((q) => q !== quote);
      setIsFav(false);
    } else {
      data.favoriteQuotes.push(quote);
      setIsFav(true);
    }
    saveData(data);
  };

  const saveCheckin = () => {
    if (!mood) return;
    const data = loadData();
    const today = todayKey();
    data.dailyMood = data.dailyMood.filter((m) => m.date !== today);
    data.dailyMood.push({ date: today, mood, mindfulnessLevel: mindfulness });
    saveData(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5">
      <header className="pt-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <h1 className="mt-1 text-2xl font-light text-foreground">Dhamma Reflection</h1>
      </header>

      <section className="rounded-3xl bg-card p-7 shadow-[var(--shadow-card)] animate-scale-in">
        <div className="mb-3 text-3xl text-gold opacity-70">❝</div>
        <p className="text-lg leading-relaxed text-foreground font-light">{quote}</p>
        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            onClick={toggleFav}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary transition-transform active:scale-90"
            aria-label="Favorite quote"
          >
            <span className="text-lg">{isFav ? "❤️" : "🤍"}</span>
          </button>
          <button
            onClick={newQuote}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary transition-transform active:scale-90"
            aria-label="New quote"
          >
            <span className="text-lg">🔄</span>
          </button>
        </div>
      </section>

      <section className="rounded-3xl bg-card p-6 shadow-[var(--shadow-card)]">
        <h2 className="text-base font-medium">How are you feeling?</h2>
        <div className="mt-4 flex justify-between gap-1">
          {MOODS.map((m) => (
            <button
              key={m.value}
              onClick={() => setMood(m.value)}
              className={`flex flex-1 flex-col items-center gap-1 rounded-2xl py-3 transition-all active:scale-90 ${
                mood === m.value ? "bg-primary/15 ring-2 ring-primary" : "bg-secondary/50"
              }`}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className="text-[10px] text-muted-foreground">{m.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-5">
          <div className="mb-2 flex justify-between text-xs text-muted-foreground">
            <span>Mindfulness</span>
            <span className="font-medium text-foreground">{mindfulness} / 5</span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            value={mindfulness}
            onChange={(e) => setMindfulness(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <button
          onClick={saveCheckin}
          disabled={!mood}
          className="mt-5 w-full rounded-full bg-primary py-3 font-medium text-primary-foreground transition-transform active:scale-95 disabled:opacity-40"
        >
          {saved ? "✓ Saved" : "Save Today's Check-in"}
        </button>
      </section>

      <section className="rounded-3xl bg-card p-6 shadow-[var(--shadow-card)]">
        <p className="text-base text-foreground font-light">Take a moment to reflect on your day.</p>
        <Link
          to="/journal/new"
          className="mt-4 flex items-center justify-center rounded-full bg-gold py-3 font-medium text-gold-foreground transition-transform active:scale-95"
        >
          Write Today's Reflection
        </Link>
      </section>
    </div>
  );
}

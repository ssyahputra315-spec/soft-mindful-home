import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { loadData, saveData } from "@/lib/storage";

export const Route = createFileRoute("/meditate/session")({
  validateSearch: (s: Record<string, unknown>) => ({ duration: Number(s.duration) || 10 }),
  component: SessionPage,
});

function playBell() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = 528;
    o.type = "sine";
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 4);
  } catch {}
}

function SessionPage() {
  const { duration } = Route.useSearch();
  const navigate = useNavigate();
  const total = duration * 60;
  const [remaining, setRemaining] = useState(total);
  const [running, setRunning] = useState(true);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!running) return;
    if (remaining <= 0) {
      if (!completedRef.current) {
        completedRef.current = true;
        const data = loadData();
        if (data.settings.bellSound) playBell();
        data.meditationSessions.push({ date: new Date().toISOString(), duration });
        saveData(data);
      }
      return;
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [running, remaining, duration]);

  const m = Math.floor(remaining / 60).toString().padStart(2, "0");
  const s = (remaining % 60).toString().padStart(2, "0");
  const progress = 1 - remaining / total;
  const done = remaining <= 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background px-6">
      <div className="relative flex h-72 w-72 items-center justify-center">
        <svg className="absolute inset-0" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1" className="text-border" />
          <circle
            cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2"
            className="text-primary transition-all duration-1000"
            strokeDasharray={`${progress * 289} 289`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className={`absolute inset-10 rounded-full bg-primary/10 ${running && !done ? "animate-breathe" : ""}`} />
        <div className="relative text-center">
          {done ? (
            <>
              <div className="text-5xl">🪷</div>
              <p className="mt-3 text-base font-light text-foreground">Session complete</p>
            </>
          ) : (
            <>
              <div className="text-6xl font-light tabular-nums text-foreground">{m}:{s}</div>
              <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                {running ? "Breathe" : "Paused"}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="mt-12 flex gap-3">
        {!done && (
          <button
            onClick={() => setRunning((r) => !r)}
            className="rounded-full bg-secondary px-6 py-3 text-sm font-medium text-foreground active:scale-95"
          >
            {running ? "Pause" : "Resume"}
          </button>
        )}
        <button
          onClick={() => navigate({ to: "/meditate" })}
          className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground active:scale-95"
        >
          {done ? "Done" : "End"}
        </button>
      </div>
    </div>
  );
}


import { useState } from "react";
import { analyzeRecordingUrl } from "@/lib/audio/chord-analysis";
import type { ChordEstimate } from "@/lib/audio/chord-analysis";
import type { Recording } from "@/types/recording";

interface ChordAnalysisPanelProps {
  recording: Recording;
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

export function ChordAnalysisPanel({
  recording,
}: ChordAnalysisPanelProps) {
  const [results, setResults] = useState<ChordEstimate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const timeline = await analyzeRecordingUrl(recording.audioUrl);
      setResults(timeline);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Chord analysis failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-4 rounded-xl border p-4">
      <div>
        <h2 className="font-semibold">Chord analysis</h2>
        <p className="text-sm text-muted-foreground">
          Analyze {recording.title} for major and minor chords.
        </p>
      </div>

      <button
        type="button"
        onClick={handleAnalyze}
        disabled={loading}
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
      >
        {loading ? "Analyzing recording..." : "Analyze chords"}
      </button>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      {results.length > 0 && (
        <ol className="divide-y">
          {results.map((item, index) => (
            <li
              key={`${item.start}-${item.chord}-${index}`}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="min-w-16 text-sm text-muted-foreground">
                  {formatTime(item.start)}
                </span>
                <span className="text-lg font-semibold">
                  {item.chord}
                </span>
              </div>

              <span className="text-right text-xs text-muted-foreground">
                to {formatTime(item.end)}
                <br />
                score: {item.score.toFixed(2)}
              </span>
            </li>
          ))}
        </ol>
      )}

      {results.length === 0 && !loading && !error && (
        <p className="text-sm text-muted-foreground">
          No analysis yet. Select Analyze chords to begin.
        </p>
      )}
    </section>
  );
}
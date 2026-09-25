import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { submitLead } from "@/lib/leads.functions";
import { GOALS, type Lane } from "@/lib/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

export default function IntakeForm() {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState<string>(GOALS[0]);
  const [motivation, setMotivation] = useState("");
  const [lane, setLane] = useState<Lane | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const doSubmit = useServerFn(submitLead);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!lane) {
      toast.error("Choose your lane: Gym or Online");
      return;
    }
    setSubmitting(true);
    try {
      await doSubmit({ data: { name, goal, motivation, lane } });
      setDone(true);
    } catch {
      toast.error("Could not submit — please try again");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-primary/50 bg-secondary">
            <Check className="size-7 text-primary" />
          </div>
          <h1 className="mt-6 font-display text-3xl uppercase tracking-wide text-foreground">You're in, {name.split(" ")[0]}.</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Ariana is reviewing your intake and will message you shortly with your quote. No excuses, no dramas.
          </p>
          <p className="mt-6 font-display text-sm uppercase tracking-[0.25em] text-primary">Sin Excusas Sin Dramas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-4 py-12 text-foreground">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl uppercase tracking-wide">ASclub</h1>
          <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-primary">Sin Excusas Sin Dramas</p>
          <p className="mt-4 text-sm text-muted-foreground">
            Start your assessment. Ariana reviews every submission personally and sends your quote by WhatsApp.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Your name</Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="María García" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="goal">Your goal</Label>
            <select
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="h-10 rounded-md border border-input bg-secondary px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {GOALS.map((g) => (
                <option key={g} value={g} className="bg-card text-foreground">
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="motivation">Why now?</Label>
            <Textarea
              id="motivation"
              required
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              placeholder="What's driving you to start right now?"
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Your lane</Label>
            <div className="grid grid-cols-2 gap-3">
              {(["gym", "online"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setLane(option)}
                  className={
                    "rounded-lg border px-4 py-3 text-sm transition-colors " +
                    (lane === option
                      ? "border-primary bg-secondary text-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-primary/40")
                  }
                >
                  <span className="font-display uppercase tracking-wide">{option === "gym" ? "Gym" : "Online"}</span>
                  <p className="mt-1 text-xs opacity-80">
                    {option === "gym" ? "Train in Palma, pay at the facility" : "Remote coaching, pay by link"}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? "Sending…" : "Send my intake"}
          </Button>
        </form>
      </div>
    </div>
  );
}

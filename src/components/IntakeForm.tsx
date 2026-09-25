import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { submitLead } from "@/lib/leads.functions";
import { COMMITMENT_OPTIONS, GOALS, SERVICES } from "@/lib/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const STEPS = ["Goal", "Service", "Motivation", "Objection", "Commitment", "Register"] as const;

function optionButton(selected: boolean, onClick: () => void, title: string, subtitle?: string) {
  return (
    <button
      key={title}
      type="button"
      onClick={onClick}
      className={
        "w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors " +
        (selected
          ? "border-primary bg-secondary text-foreground"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground")
      }
    >
      <span className="font-medium text-foreground">{title}</span>
      {subtitle && <span className="mt-1 block text-xs opacity-80">{subtitle}</span>}
    </button>
  );
}

export default function IntakeForm() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [instagram, setInstagram] = useState("");
  const [goal, setGoal] = useState<string | null>(null);
  const [service, setService] = useState<string | null>(null);
  const [motivation, setMotivation] = useState("");
  const [objection, setObjection] = useState("");
  const [commitment, setCommitment] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const doSubmit = useServerFn(submitLead);

  const canContinue =
    (step === 0 && goal !== null) ||
    (step === 1 && service !== null) ||
    (step === 2 && motivation.trim().length >= 2) ||
    (step === 3 && objection.trim().length >= 2) ||
    (step === 4 && commitment !== null) ||
    (step === 5 && name.trim().length >= 2 && email.trim().length >= 3);

  function next() {
    if (!canContinue) {
      toast.error("Please complete this step first");
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  async function handleSubmit() {
    if (!goal || !service || !commitment) {
      toast.error("Please complete every step");
      return;
    }
    setSubmitting(true);
    try {
      await doSubmit({
        data: {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          country: country.trim(),
          instagram: instagram.trim(),
          goal,
          service,
          motivation: motivation.trim(),
          objection: objection.trim(),
          commitment,
        },
      });
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
          <h1 className="mt-6 font-display text-3xl uppercase tracking-wide text-foreground">
            You're in, {name.split(" ")[0]}.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Ariana is reviewing your intake and will message you shortly with your quote. No excuses, no dramas.
          </p>
          <p className="mt-6 font-display text-sm uppercase tracking-[0.25em] text-primary">Sin Excusas Sin Dramas</p>
        </div>
      </div>
    );
  }

  const subtitles: Record<number, string> = {
    0: "What is your goal?",
    1: "Which service are you interested in?",
    2: "Why start taking care of yourself now?",
    3: "What's holding you back from taking your first step?",
    4: "Ariana's method is built for people who want to improve their quality of life through training and nutrition. Are you willing to invest in improving your quality of life?",
    5: "Register — Ariana will send your quote by WhatsApp.",
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-4 py-10 text-foreground">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="font-display text-4xl uppercase tracking-wide">ASclub</h1>
          <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-primary">Sin Excusas Sin Dramas</p>
        </div>

        <div className="mb-4 flex items-center justify-center gap-1.5">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={
                "h-1 w-8 rounded-full transition-colors " +
                (i < step ? "bg-primary" : i === step ? "bg-primary/60" : "bg-border")
              }
            />
          ))}
        </div>
        <p className="mb-1 text-center text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          Step {step + 1} of {STEPS.length} · {STEPS[step]}
        </p>

        <div className="rounded-xl border border-border bg-card p-6">
          <p className="mb-4 font-display text-lg uppercase tracking-wide">{subtitles[step]}</p>

          {step === 0 && (
            <div className="flex flex-col gap-2.5">
              {GOALS.map((g) => optionButton(goal === g, () => setGoal(g), g))}
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-2.5">
              {SERVICES.map((s) => optionButton(service === s, () => setService(s), s))}
            </div>
          )}

          {step === 2 && (
            <Textarea
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              placeholder="Tell me what motivates you to start"
              rows={4}
            />
          )}

          {step === 3 && (
            <Textarea
              value={objection}
              onChange={(e) => setObjection(e.target.value)}
              placeholder="I have little time, I'm stuck, …"
              rows={4}
            />
          )}

          {step === 4 && (
            <div className="flex flex-col gap-2.5">
              {COMMITMENT_OPTIONS.map((c) => optionButton(commitment === c, () => setCommitment(c), c))}
            </div>
          )}

          {step === 5 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="María García" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="maria@email.com" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+34 600 000 000" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Spain" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="instagram">Your Instagram @</Label>
                <Input id="instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@username" />
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            {step > 0 && (
              <Button type="button" variant="outline" size="icon" onClick={() => setStep((s) => s - 1)} aria-label="Back">
                <ArrowLeft className="size-4" />
              </Button>
            )}
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={next} className="flex-1 gap-2">
                Continue <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit} disabled={submitting} className="flex-1">
                {submitting ? "Sending…" : "Submit"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

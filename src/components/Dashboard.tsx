import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { listLeads, updateLeadStatus } from "@/lib/leads.functions";
import { buildWhatsAppMessage, suggestedPrice, type Lane, type Lead, type LeadStatus } from "@/lib/leads";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, Copy, Check, RefreshCw, Smartphone } from "lucide-react";

function laneBadge(lane: Lane) {
  return lane === "online" ? (
    <Badge className="border-transparent bg-accent text-accent-foreground">ONLINE</Badge>
  ) : (
    <Badge className="border-transparent bg-secondary text-secondary-foreground">GYM</Badge>
  );
}

function statusDot(status: LeadStatus) {
  return (
    <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground">
      <span
        className={
          "size-1.5 rounded-full " + (status === "new" ? "bg-primary" : "bg-muted-foreground/60")
        }
      />
      {status === "new" ? "New" : "Pending"}
    </span>
  );
}

function LeadRow({ lead, active, onClick }: { lead: Lead; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={
        "w-full rounded-lg border px-4 py-3 text-left transition-colors " +
        (active
          ? "border-primary/60 bg-secondary"
          : "border-border bg-card hover:border-primary/40 hover:bg-secondary/60")
      }
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-lg uppercase tracking-wide text-foreground">{lead.name}</span>
        {statusDot(lead.status)}
      </div>
      <div className="mt-1.5 flex items-center gap-2">
        <span className="truncate text-xs text-muted-foreground">{lead.goal}</span>
      </div>
      <div className="mt-2">{laneBadge(lead.lane)}</div>
    </button>
  );
}

export default function Dashboard() {
  const { data: leads = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ["leads"],
    queryFn: useServerFn(listLeads),
    refetchInterval: 4000,
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [qrOpen, setQrOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const selected = useMemo(
    () => leads.find((l) => l.id === selectedId) ?? leads[0] ?? null,
    [leads, selectedId],
  );

  const price = selected ? prices[selected.id] ?? (selected.price != null ? String(selected.price) : "") : "";
  const numericPrice = price ? Number(price) : null;
  const message = selected ? buildWhatsAppMessage(selected, numericPrice) : "";

  const newCount = leads.filter((l) => l.status === "new").length;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      toast.success("Message copied — paste it in WhatsApp");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy — select the text manually");
    }
  }

  async function handleContacted() {
    if (!selected) return;
    try {
      await updateLeadStatus({ data: { id: selected.id, status: "pending" } });
      toast.success(`${selected.name} marked as contacted`);
      refetch();
    } catch {
      toast.error("Could not update the lead");
    }
  }

  const intakeUrl = typeof window !== "undefined" ? `${window.location.origin}/intake` : "/intake";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div className="flex items-baseline gap-4">
          <span className="font-display text-2xl uppercase tracking-wide">ASclub <span className="text-primary">OS</span></span>
          <span className="hidden text-[11px] uppercase tracking-[0.25em] text-muted-foreground sm:inline">
            Sin Excusas Sin Dramas
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 rounded-full border border-primary/40 px-3 py-1 text-xs text-primary">
            <span className="size-1.5 rounded-full bg-primary" />
            {newCount} new leads
          </span>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
            <RefreshCw className={"size-3.5 " + (isFetching ? "animate-spin" : "")} />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setQrOpen(true)} className="gap-2">
            <QrCode className="size-3.5" />
            Intake QR
          </Button>
        </div>
      </header>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">Loading leads…</div>
      ) : (
        <main className="flex flex-1 flex-col md:grid md:grid-cols-[minmax(280px,360px)_1fr]">
          {/* Lead list */}
          <aside className="border-b border-border md:border-b-0 md:border-r">
            <div className="border-b border-border px-5 py-3">
              <h2 className="font-display text-sm uppercase tracking-[0.2em] text-muted-foreground">
                Leads · {leads.length}
              </h2>
            </div>
            <ScrollArea className="h-[calc(100vh-160px)]">
              <div className="flex flex-col gap-2 p-3">
                {leads.map((lead) => (
                  <LeadRow
                    key={lead.id}
                    lead={lead}
                    active={selected?.id === lead.id}
                    onClick={() => setSelectedId(lead.id)}
                  />
                ))}
                {leads.length === 0 && (
                  <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No leads yet. Scan the intake QR and watch this board fill up.
                  </p>
                )}
              </div>
            </ScrollArea>
          </aside>

          {/* Workspace */}
          <section className="flex flex-col">
            {!selected ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
                <p className="font-display text-xl uppercase tracking-wide text-muted-foreground">Select a lead</p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Pick a lead from the left to review, price and dispatch their quote.
                </p>
              </div>
            ) : (
              <>
                <div className="border-b border-border px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h1 className="font-display text-3xl uppercase tracking-wide">{selected.name}</h1>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Goal: {selected.goal} · Motivation: {selected.motivation}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {laneBadge(selected.lane)}
                      {statusDot(selected.status)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-6 p-6 lg:max-w-2xl">
                  {/* Price input */}
                  <div>
                    <label htmlFor="price" className="font-display text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Suggested price
                    </label>
                    <div className="relative mt-2">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-primary">€</span>
                      <Input
                        id="price"
                        type="number"
                        min={0}
                        inputMode="decimal"
                        value={price}
                        placeholder={String(suggestedPrice(selected))}
                        onChange={(e) => {
                          setPrices((p) => ({ ...p, [selected.id]: e.target.value }));
                        }}
                        className="h-14 bg-card pl-10 font-display text-2xl tracking-wide"
                      />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      The message below re-renders instantly as you type.
                    </p>
                  </div>

                  {/* Message preview */}
                  <div className="rounded-xl border border-border bg-card p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-display text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Drafted WhatsApp message · English
                      </span>
                      <Smartphone className="size-4 text-muted-foreground" />
                    </div>
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground/90">{message}</pre>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <Button size="lg" onClick={handleCopy} className="gap-2">
                      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                      Copy to WhatsApp
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={handleContacted}
                      disabled={selected.status === "pending"}
                    >
                      {selected.status === "pending" ? "Already contacted" : "Mark as Contacted"}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </section>
        </main>
      )}

      {/* QR dialog */}
      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="bg-card sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display uppercase tracking-wide">Scan to join the intake</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="rounded-xl bg-white p-4">
              <QRCodeSVG value={intakeUrl} size={192} />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Point your phone camera at the code — the intake form opens and your lead lands on this board live.
            </p>
            <code className="rounded bg-secondary px-2 py-1 text-xs text-muted-foreground">{intakeUrl}</code>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

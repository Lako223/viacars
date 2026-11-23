import { useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { bookingSchema, buildBookingUrl, copy, serviceIds, serviceNames, type Language } from "@/lib/viacars";

export function BookingForm({ lang }: { lang: Language }) {
  const t = copy[lang];
  const [error, setError] = useState(false);
  const [sent, setSent] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const parsed = bookingSchema.safeParse(values);
    if (!parsed.success) { setError(true); setSent(false); return; }
    setError(false);
    const a = document.createElement("a");
    a.href = buildBookingUrl(parsed.data, lang);
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.click();
    setSent(true);
  }
  return <form className="booking-form" onSubmit={submit}>
    <div className="field"><label htmlFor="name">{t.labels[0]}</label><input id="name" name="name" autoComplete="name" required minLength={2} maxLength={100} placeholder={t.placeholders[0]} /></div>
    <div className="field"><label htmlFor="phone">{t.labels[1]}</label><input id="phone" name="phone" type="tel" autoComplete="tel" required minLength={6} maxLength={25} placeholder={t.placeholders[1]} /></div>
    <div className="field"><label htmlFor="date">{t.labels[2]}</label><input id="date" name="date" type="date" required /></div>
    <div className="field"><label htmlFor="time">{t.labels[3]}</label><input id="time" name="time" type="time" required /></div>
    <div className="field"><label htmlFor="departure">{t.labels[4]}</label><input id="departure" name="departure" required minLength={2} maxLength={200} placeholder={t.placeholders[2]} /></div>
    <div className="field"><label htmlFor="destination">{t.labels[5]}</label><input id="destination" name="destination" required minLength={2} maxLength={200} placeholder={t.placeholders[3]} /></div>
    <div className="field"><label htmlFor="passengers">{t.labels[6]}</label><input id="passengers" name="passengers" type="number" required min={1} max={20} defaultValue={1} /></div>
    <div className="field"><label htmlFor="service">{t.labels[7]}</label><select id="service" name="service" required>{serviceIds.map(id => <option key={id} value={id}>{serviceNames[lang][id]}</option>)}</select></div>
    <div className="col-span-2 space-y-4">
      {error && <p role="alert" className="form-error">{t.error}</p>}
      {sent && <p role="status" className="text-sm text-silver">{t.sent}</p>}
      <p className="text-[10px] leading-relaxed text-muted-foreground">{t.privacyNote} <Link className="underline" to="/privacy" search={lang === 'en' ? { lang: 'en' } : {}}>Privacy Policy</Link></p>
      <Button type="submit" variant="premium" className="h-12 w-full justify-between px-5">{t.send}<ArrowUpRight /></Button>
      <p className="text-[10px] text-muted-foreground">{t.formNote}</p>
    </div>
  </form>;
}
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { motion, MotionConfig, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowRight, ArrowUpRight, Bus, CarFront, Check, ChevronRight, Clock3, Facebook, Luggage, Mail, MapPin, Menu, MessageCircle, Phone, Plane, Quote, ShieldCheck, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingForm } from "@/components/viacars/booking-form";
import { copy, whatsappNumber, type Language } from "@/lib/viacars";
import heroAsset from "@/assets/rome.webp.asset.json";
import minivanAsset from "@/assets/minivan.webp.asset.json";
import minibusAsset from "@/assets/minibus.webp.asset.json";
import wordmark from "@/assets/wordmark.svg.asset.json";
import logo from "@/assets/logo.svg.asset.json";

export const Route = createFileRoute("/")({
  head: ({ match }) => {
    const en = match.search.lang === 'en';
    const title = en ? "Viacars Service | Chauffeur service & airport transfers in Rome" : "Viacars Service | NCC Roma, transfer aeroporti e minibus con conducente";
    const description = en ? "Mercedes chauffeur service in Rome and throughout Italy. Fiumicino and Ciampino airport transfers, city tours, 7/8-seat minivans and 20-seat minibuses." : "NCC Roma con flotta Mercedes: transfer aeroporto Fiumicino e Ciampino, tour, minivan 7/8 posti e noleggio minibus con conducente Roma e tutta Italia.";
    return { meta: [{ title }, { name: 'description', content: description }, { property: 'og:title', content: title }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }], scripts: [{ type: 'application/ld+json', children: JSON.stringify({ '@context': 'https://schema.org', '@type': 'LocalBusiness', name: 'Viacars Service', legalName: 'Viacars.service srl', description, telephone: ['+39 345 223 3522', '+39 347 546 8855'], email: 'info@viacars.it', address: { '@type': 'PostalAddress', streetAddress: 'Via Pisino 195', postalCode: '00177', addressLocality: 'Roma', addressCountry: 'IT' }, areaServed: { '@type': 'Country', name: 'Italia' }, sameAs: ['https://www.facebook.com/prenotazioniviacars.service'] }) }] };
  },
  component: Index,
});

const sections = ['servizi', 'perche-viacars', 'flotta', 'contatti'];
const serviceIcons = [MapPin, Plane, Users, Bus];
const reasonIcons = [CarFront, Clock3, Luggage, MapPin];
const fleetImages = [heroAsset, minivanAsset, minibusAsset];
const waLink = `https://wa.me/${whatsappNumber}`;

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ duration: .55, ease: 'easeOut', delay: reduced ? 0 : delay }}>{children}</motion.div>;
}

function Index() {
  const search = Route.useSearch();
  const lang: Language = search.lang === 'en' ? 'en' : 'it';
  const t = copy[lang];
  const navigate = Route.useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [fleet, setFleet] = useState(-1);
  const [showMap, setShowMap] = useState(false);
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 900], [0, reduced ? 0 : 140]);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 40);
    update(); window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const langSearch = lang === 'en' ? { lang: 'en' as const } : {};
  return <MotionConfig reducedMotion="user">
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container-site flex items-center justify-between gap-5">
        <a href="#" aria-label="Viacars Service"><img src={wordmark.url} alt="Viacars Service" className="brand-wordmark" /></a>
        <nav aria-label={lang === 'it' ? 'Navigazione principale' : 'Main navigation'} className="hidden items-center gap-8 lg:flex">{t.nav.map((label, i) => <a key={label} className="nav-link" href={`#${sections[i]}`}>{label}</a>)}</nav>
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="flex items-center gap-1 text-[11px]" aria-label="Language"><Button variant="ghost" size="sm" className={lang === 'it' ? 'px-1 text-foreground' : 'px-1 text-muted-foreground'} aria-pressed={lang === 'it'} onClick={() => { void navigate({ search: {}, replace: true, resetScroll: false }); }}>IT</Button><span className="text-muted-foreground">/</span><Button variant="ghost" size="sm" className={lang === 'en' ? 'px-1 text-foreground' : 'px-1 text-muted-foreground'} aria-pressed={lang === 'en'} onClick={() => { void navigate({ search: { lang: 'en' }, replace: true, resetScroll: false }); }}>EN</Button></div>
          <Button asChild variant="glass" className="hidden h-10 px-5 text-[11px] sm:inline-flex"><a href="#prenotazione">{t.book}<ArrowUpRight /></a></Button>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label={menu ? (lang === 'it' ? 'Chiudi menu' : 'Close menu') : (lang === 'it' ? 'Apri menu' : 'Open menu')} aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</Button>
        </div>
      </div>
      {menu && <nav className="mobile-menu lg:hidden">{t.nav.map((label, i) => <a key={label} href={`#${sections[i]}`} onClick={() => setMenu(false)} className="nav-link">{label}</a>)}<Button asChild variant="premium"><a href="#prenotazione" onClick={() => setMenu(false)}>{t.book}<ArrowUpRight /></a></Button></nav>}
    </header>

    <main>
      <section className="hero">
        <motion.img src={heroAsset.url} className="hero-image" alt={lang === 'it' ? 'Mercedes nera davanti al Colosseo a Roma, immagine illustrativa' : 'Black Mercedes by the Colosseum in Rome, illustrative image'} fetchPriority="high" style={{ y: heroY }} />
        <div className="hero-shade" /><div className="hero-bottom" />
        <div className="container-site hero-content">
          <Reveal><p className="eyebrow eyebrow-line">Viacars Service · {t.heroLabel}</p></Reveal>
          <h1 className="hero-heading" key={lang}>
            {t.claim.split(' ').map((word, i) => <motion.span key={`${word}-${i}`} className="inline-block" initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: reduced ? 0 : i * .045 }}>{word}&nbsp;</motion.span>)}
          </h1>
          <Reveal delay={.3}><p className="hero-claim">{t.mercedes}. {t.italy}.</p><div className="hero-actions"><Button asChild variant="premium"><a href={waLink} target="_blank" rel="noopener noreferrer"><MessageCircle />{t.whatsapp}<ArrowUpRight /></a></Button><Button asChild variant="glass"><a href="tel:+393452233522"><Phone />{t.call}</a></Button></div></Reveal>
          <div className="hero-caption"><div className="hero-caption-left"><span className="flex items-center gap-2"><MapPin size={13} />{t.italy}</span><span className="caption-divider" /><span className="flex items-center gap-2"><ShieldCheck size={13} /><span className="hidden sm:inline">{t.mercedes}</span><span className="sm:hidden">Mercedes</span></span></div><a href="#servizi" className="flex items-center gap-3"><span className="hidden sm:inline">{t.discover}</span><ArrowDown size={16} /></a></div>
        </div>
      </section>

      <section id="servizi" className="section-band">
        <div className="container-site">
          <Reveal className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><div><p className="eyebrow">{t.servicesLabel}</p><h2 className="section-heading max-w-xl">{t.servicesTitle}</h2></div><p className="section-intro lg:max-w-[315px]">{t.servicesIntro}</p></Reveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{t.serviceTitles.map((title, i) => {
            const Icon = serviceIcons[i] ?? CarFront;
            return <Reveal key={title} delay={i * .08}><motion.a href="#prenotazione" className="service-card block" whileHover={reduced ? {} : { y: -5, scale: 1.02 }} transition={{ duration: .4 }}><Icon className="service-icon" /><span className="service-index">0{i + 1}</span><h3>{title}</h3><p>{t.serviceDescriptions[i]}</p><ArrowUpRight className="mt-6 h-4 w-4 text-silver" /></motion.a></Reveal>;
          })}</div>
        </div>
      </section>

      <section id="perche-viacars" className="section-band reason-band"><div className="container-site grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20"><Reveal><p className="eyebrow">{t.whyLabel}</p><h2 className="section-heading whitespace-pre-line">{t.whyTitle}</h2><div className="mt-7 flex items-center gap-3 text-xs text-silver"><Check size={15} />{t.mercedes}</div></Reveal><div className="grid gap-9 sm:grid-cols-2">{t.reasons.map((reason, i) => { const Icon = reasonIcons[i] ?? ShieldCheck; return <Reveal key={reason} delay={i * .08} className="reason-item"><Icon /><div><h3>{reason}</h3><p>{t.reasonDescriptions[i]}</p></div></Reveal>; })}{/* Disponibilità 24/7: non pubblicare finché non confermata. */}</div></div></section>

      <section id="flotta" className="section-band"><div className="container-site"><Reveal className="mb-9 flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><p className="eyebrow">{t.fleetLabel}</p><h2 className="section-heading">{t.fleetTitle}</h2><p className="section-intro mt-4">{t.fleetIntro}</p></div><div className="fleet-tabs" aria-label={t.fleetLabel}><Button variant="ghost" size="sm" aria-pressed={fleet === -1} onClick={() => setFleet(-1)}>{t.all}</Button>{t.categories.map((category, i) => <Button key={category} variant="ghost" size="sm" aria-pressed={fleet === i} onClick={() => setFleet(i)}>{category}</Button>)}</div></Reveal><div className="grid gap-6 md:grid-cols-3">{t.categories.map((category, i) => { if (fleet !== -1 && fleet !== i) return null; const image = fleetImages[i]; if (!image) return null; return <Reveal key={category} className="fleet-card" delay={i * .08}><img src={image.url} alt={`${category} Mercedes — ${lang === 'it' ? 'immagine illustrativa' : 'illustrative image'}`} loading="lazy" /><div className="mt-5 flex items-center justify-between"><h3 className="font-display text-xl">{category}</h3><a href="#prenotazione" aria-label={`${t.book}: ${category}`}><ArrowUpRight size={18} /></a></div><p className="mt-2 text-xs text-muted-foreground">{t.seats[i]}</p></Reveal>; })}</div><p className="mt-6 text-[10px] text-muted-foreground">{t.provisional}</p></div></section>

      <section id="recensioni" className="section-band pt-0"><div className="container-site"><Reveal><p className="eyebrow">{t.reviewsLabel}</p><h2 className="section-heading">{t.reviewsTitle}</h2><div className="review-empty"><Quote className="h-8 w-8 shrink-0 stroke-1 text-silver" /><p className="text-sm text-muted-foreground">{t.reviewsEmpty}</p></div>{/* Inserire qui 3–4 recensioni reali prima di attivare il carosello. Nessuna recensione inventata. */}</Reveal></div></section>

      <section id="prenotazione" className="section-band booking-band"><div className="container-site grid gap-11 lg:grid-cols-[.8fr_1.2fr] lg:gap-24"><Reveal><p className="eyebrow">{t.bookingLabel}</p><h2 className="section-heading whitespace-pre-line">{t.bookingTitle}</h2><p className="section-intro mt-6 max-w-[310px]">{t.bookingIntro}</p><a href="tel:+393452233522" className="mt-8 inline-flex items-center gap-3 text-sm"><Phone size={16} />+39 345 223 3522</a></Reveal><Reveal delay={.1}><BookingForm lang={lang} /></Reveal></div></section>

      <section id="contatti" className="section-band"><div className="container-site"><Reveal className="mb-10"><p className="eyebrow">{t.contactsLabel}</p><h2 className="section-heading">{t.contactsTitle}</h2></Reveal><div className="grid gap-10 lg:grid-cols-2"><Reveal className="space-y-6"><div className="contact-link"><MapPin /><div><p className="mb-1 text-[10px] text-muted-foreground">{t.address}</p><a href="https://www.google.com/maps/search/?api=1&query=Via+Pisino+195+00177+Roma" target="_blank" rel="noopener noreferrer">Via Pisino 195<br />00177 Roma, Italia</a></div></div><div className="contact-link"><Phone /><div><a href="tel:+393452233522">+39 345 223 3522</a><br /><a href="tel:+393475468855">+39 347 546 8855</a></div></div><a href="mailto:info@viacars.it" className="contact-link"><Mail />info@viacars.it</a><a href="https://www.facebook.com/prenotazioniviacars.service" target="_blank" rel="noopener noreferrer" className="contact-link"><Facebook />Viacars Service<ArrowUpRight size={14} /></a></Reveal><Reveal className="map-panel">{showMap ? <iframe title={lang === 'it' ? 'Sede Viacars Service a Roma' : 'Viacars Service office in Rome'} src="https://maps.google.com/maps?q=Via%20Pisino%20195%2000177%20Roma&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /> : <div className="px-5 text-center"><MapPin className="mx-auto mb-5 h-8 w-8 stroke-1 text-silver" /><p className="mb-5 text-sm">Via Pisino 195 · Roma</p><Button variant="glass" onClick={() => setShowMap(true)}>{t.map}<ArrowUpRight /></Button><p className="mt-4 max-w-[280px] text-[10px] leading-relaxed text-muted-foreground">{t.mapNote}</p></div>}</Reveal></div></div></section>
    </main>

    <footer className="border-t border-border py-10"><div className="container-site"><div className="flex flex-col justify-between gap-8 sm:flex-row"><div><img className="footer-logo" src={logo.url} alt="Viacars Service" loading="lazy" /><p className="mt-3 text-xs text-muted-foreground">{t.footer}</p></div><div className="space-y-3 text-xs text-silver"><p>Viacars.service srl</p><p>Via Pisino 195, 00177 Roma</p><a href="mailto:info@viacars.it" className="block">info@viacars.it</a><a href="tel:+393452233522" className="block">+39 345 223 3522</a><p className="text-muted-foreground">{t.vat}</p></div></div><div className="mt-9 flex flex-col justify-between gap-5 border-t border-border pt-6 text-[10px] text-muted-foreground sm:flex-row"><p>© {new Date().getFullYear()} Viacars Service. {t.rights}</p><div className="flex gap-6"><Link to="/privacy" search={langSearch}>Privacy Policy</Link><Link to="/cookie-policy" search={langSearch}>Cookie Policy</Link></div></div></div></footer>
    <Button asChild variant="whatsapp" size="icon" className="floating-whatsapp"><a href={waLink} target="_blank" rel="noopener noreferrer" aria-label={t.whatsapp} title={t.whatsapp}><MessageCircle /></a></Button>
  </MotionConfig>;
}

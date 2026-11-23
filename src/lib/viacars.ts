import { z } from "zod";

export type Language = "it" | "en";
export const whatsappNumber = "393452233522";
export const serviceIds = ["transfer", "tour", "minivan", "minibus"] as const;
export const bookingSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(6).max(25).regex(/^[+\d\s().-]+$/),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
    const date = new Date(value + "T12:00:00Z");
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  departure: z.string().trim().min(2).max(200),
  destination: z.string().trim().min(2).max(200),
  passengers: z.coerce.number().int().min(1).max(20),
  service: z.enum(serviceIds),
}).superRefine((data, ctx) => {
  if (data.service === "minivan" && data.passengers > 8) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["passengers"], message: "Il minivan può ospitare fino a 8 passeggeri / Up to 8 passengers." });
  }
});
export type Booking = z.infer<typeof bookingSchema>;
export const serviceNames = {
  it: { transfer: "Transfer aeroporti e stazioni", tour: "Tour della città", minivan: "Minivan 7/8 posti", minibus: "Minibus 20 posti" },
  en: { transfer: "Airport & station transfers", tour: "City tours", minivan: "7/8-seat minivan", minibus: "20-seat minibus" },
};
export function buildBookingUrl(input: unknown, lang: Language) {
  const d = bookingSchema.parse(input);
  const message = lang === "it"
    ? `Buongiorno Viacars Service, vorrei richiedere un preventivo.\n\nNome: ${d.name}\nTelefono: ${d.phone}\nData: ${d.date}\nOra: ${d.time}\nPartenza: ${d.departure}\nDestinazione: ${d.destination}\nPasseggeri: ${d.passengers}\nServizio: ${serviceNames.it[d.service]}`
    : `Hello Viacars Service, I would like to request a quote.\n\nName: ${d.name}\nPhone: ${d.phone}\nDate: ${d.date}\nTime: ${d.time}\nPick-up: ${d.departure}\nDestination: ${d.destination}\nPassengers: ${d.passengers}\nService: ${serviceNames.en[d.service]}`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
export const copy = {
  it: {
    nav: ["Servizi", "Perché Viacars", "Flotta", "Contatti"], book: "Prenota il tuo viaggio", whatsapp: "Prenota su WhatsApp", call: "Chiama ora",
    heroLabel: "Noleggio con conducente · Roma", heroFirst: "Il tuo viaggio.", heroSecond: "La nostra", heroEmphasis: "passione.",
    claim: "L'autonoleggio con conducente per un viaggio indimenticabile in Italia", italy: "Roma e tutta Italia", mercedes: "Flotta esclusivamente Mercedes", discover: "Scopri Viacars",
    servicesLabel: "Ogni destinazione, il nostro servizio", servicesTitle: "Il piacere di viaggiare, senza pensieri.", servicesIntro: "Dall'arrivo in aeroporto alla scoperta della città: un servizio con conducente, pensato per il tuo viaggio.",
    serviceTitles: ["Tour della città", "Aeroporti e stazioni", "Minivan con conducente", "Minibus con conducente"],
    serviceDescriptions: ["Scopri Roma e le città italiane con la libertà di un tour con conducente.", "Transfer da e per Fiumicino, Ciampino e le stazioni ferroviarie.", "Il comfort Mercedes per viaggiare insieme, con 7/8 posti a disposizione.", "Una soluzione dedicata ai gruppi, con minibus da 20 posti e conducente."],
    whyLabel: "La differenza è nei dettagli", whyTitle: "Non solo una destinazione.\nUn'esperienza.",
    reasons: ["Solo Mercedes", "Professionalità e puntualità", "Un'attenzione in più", "In tutta Italia"],
    reasonDescriptions: ["Una flotta esclusivamente Mercedes, per il comfort del tuo viaggio.", "Autisti professionisti, attenti a te e al tuo tempo.", "Ti aiutiamo con i bagagli, dall'inizio alla fine del viaggio.", "Partiamo da Roma e ti accompagniamo in tutta Italia."],
    fleetLabel: "La nostra flotta", fleetTitle: "Eleganza, in ogni viaggio.", fleetIntro: "Berline, minivan e minibus. Un'unica firma: Mercedes.", all: "Tutti", categories: ["Berline", "Minivan", "Minibus"], seats: ["Con conducente", "7/8 posti · Con conducente", "20 posti · Con conducente"], provisional: "Immagini illustrative · Le foto della flotta saranno aggiornate",
    reviewsLabel: "Le vostre esperienze", reviewsTitle: "Il viaggio, raccontato da voi.", reviewsEmpty: "Le recensioni dei nostri clienti saranno presto disponibili.",
    bookingLabel: "Il prossimo viaggio inizia qui", bookingTitle: "Dove ti\naccompagniamo?", bookingIntro: "Raccontaci il tuo itinerario. Ti rispondiamo su WhatsApp per organizzare insieme il viaggio.",
    labels: ["Nome e cognome", "Telefono", "Data del viaggio", "Ora", "Partenza", "Destinazione", "Passeggeri", "Tipo di servizio"],
    placeholders: ["Il tuo nome", "+39", "Indirizzo, aeroporto o stazione", "Dove vuoi arrivare"], send: "Richiedi su WhatsApp", formNote: "La richiesta non costituisce una prenotazione confermata.", privacyNote: "Proseguendo, i dati inseriti vengono condivisi con Viacars tramite WhatsApp.", error: "Controlla i campi: inserisci dati validi e rispetta il numero di posti del servizio.", sent: "Il messaggio è pronto su WhatsApp. Invialo per richiedere il tuo viaggio.",
    contactsLabel: "Restiamo in contatto", contactsTitle: "A Roma. Al tuo fianco, ovunque.", address: "La nostra sede", map: "Mostra mappa Google", mapNote: "La mappa viene caricata da Google solo su tua richiesta.", footer: "Il tuo viaggio in Italia, con stile.", vat: "P.IVA 14929251008", rights: "Tutti i diritti riservati.", back: "Torna al sito",
  },
  en: {
    nav: ["Services", "Why Viacars", "Fleet", "Contact"], book: "Book your journey", whatsapp: "Book on WhatsApp", call: "Call now",
    heroLabel: "Chauffeur service · Rome", heroFirst: "Your journey.", heroSecond: "Our", heroEmphasis: "passion.",
    claim: "Chauffeured car hire for an unforgettable journey in Italy", italy: "Rome and all of Italy", mercedes: "An exclusively Mercedes fleet", discover: "Discover Viacars",
    servicesLabel: "Every destination, our service", servicesTitle: "The pleasure of a carefree journey.", servicesIntro: "From your arrival at the airport to exploring the city: a chauffeur service tailored to your journey.",
    serviceTitles: ["City tours", "Airports & stations", "Chauffeured minivan", "Chauffeured minibus"],
    serviceDescriptions: ["Discover Rome and Italian cities with the freedom of a chauffeured tour.", "Transfers to and from Fiumicino, Ciampino and railway stations.", "Mercedes comfort for travelling together, with 7/8 seats available.", "A dedicated solution for groups, with a 20-seat minibus and driver."],
    whyLabel: "The difference is in the details", whyTitle: "More than a destination.\nAn experience.",
    reasons: ["Exclusively Mercedes", "Professional and punctual", "Extra care", "Throughout Italy"],
    reasonDescriptions: ["An exclusively Mercedes fleet for a comfortable journey.", "Professional drivers who care about you and your time.", "Help with your luggage, from the beginning to the end of your journey.", "Based in Rome, we accompany you throughout Italy."],
    fleetLabel: "Our fleet", fleetTitle: "Elegance, on every journey.", fleetIntro: "Sedans, minivans and minibuses. One signature: Mercedes.", all: "All", categories: ["Sedans", "Minivans", "Minibuses"], seats: ["With chauffeur", "7/8 seats · With chauffeur", "20 seats · With chauffeur"], provisional: "Illustrative images · Fleet photos will be updated",
    reviewsLabel: "Your experiences", reviewsTitle: "The journey, in your words.", reviewsEmpty: "Reviews from our customers will be available soon.",
    bookingLabel: "Your next journey starts here", bookingTitle: "Where can we\ntake you?", bookingIntro: "Tell us your itinerary. We will reply on WhatsApp to arrange your journey together.",
    labels: ["Full name", "Phone", "Travel date", "Time", "Pick-up", "Destination", "Passengers", "Service type"],
    placeholders: ["Your name", "+39", "Address, airport or station", "Where are you going?"], send: "Request on WhatsApp", formNote: "Your request is not a confirmed booking.", privacyNote: "By continuing, your details are shared with Viacars via WhatsApp.", error: "Please check your details and the passenger capacity of your selected service.", sent: "Your message is ready on WhatsApp. Send it to request your journey.",
    contactsLabel: "Get in touch", contactsTitle: "In Rome. By your side, everywhere.", address: "Our office", map: "Show Google Map", mapNote: "The map loads from Google only when you request it.", footer: "Your journey in Italy, in style.", vat: "VAT number 14929251008", rights: "All rights reserved.", back: "Back to the website",
  },
};
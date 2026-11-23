import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/viacars/legal-page";
export const Route = createFileRoute('/privacy')({
  head: ({ match }) => { const en = match.search.lang === 'en'; const title = 'Privacy Policy | Viacars Service'; const description = en ? 'Information about personal data and WhatsApp booking requests for Viacars Service.' : 'Informazioni sul trattamento dei dati personali e sulle richieste WhatsApp di Viacars Service.'; return { meta: [{ title }, { name: 'description', content: description }, { property: 'og:title', content: title }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }; },
  component: Privacy,
});
function Privacy() { const { lang } = Route.useSearch(); return <LegalPage kind="privacy" lang={lang === 'en' ? 'en' : 'it'} />; }
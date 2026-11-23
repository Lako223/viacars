import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/viacars/legal-page";
export const Route = createFileRoute('/cookie-policy')({
  head: ({ match }) => { const en = match.search.lang === 'en'; const title = 'Cookie Policy | Viacars Service'; const description = en ? 'Information about cookies and external services on the Viacars Service website.' : 'Informazioni sui cookie e sui servizi esterni del sito Viacars Service.'; return { meta: [{ title }, { name: 'description', content: description }, { property: 'og:title', content: title }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }; },
  component: Cookies,
});
function Cookies() { const { lang } = Route.useSearch(); return <LegalPage kind="cookies" lang={lang === 'en' ? 'en' : 'it'} />; }
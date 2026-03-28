import { Link } from "wouter";

export default function PrivacyPage() {
  return (
    <div className="text-foreground">
      <section className="max-w-3xl mx-auto px-6 py-16 md:py-24 space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">Privacyverklaring</h1>
        <p className="text-sm text-muted-foreground">Laatst bijgewerkt: maart 2025</p>

        <div className="space-y-8 pt-4">

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">1. Wie wij zijn</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Deze privacyverklaring is van doel.io (hierna: &#34;wij&#34; of &#34;doel.io&#34;), zonder vestiging en niet
              ingeschreven in het Handelsregister van de Kamer van Koophandel. Doel.io wordt gratis aangeboden
              zonder winstoogmerk.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Je kunt ons bereiken via e-mail:{" "}
              <a href="mailto:doelio.empower111@passmail.net" className="underline hover:text-foreground transition-colors">
                doelio.empower111@passmail.net
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">2. Op wie is deze verklaring van toepassing?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Deze privacyverklaring is van toepassing op alle gebruikers van het doel.io-platform, onze
              websitebezoekers en andere personen van wie wij persoonsgegevens verwerken in het kader van
              onze diensten.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">3. Welke gegevens verwerken wij?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Wij verwerken onder meer de volgende categorieën persoonsgegevens:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground leading-relaxed">
              <li><strong>Basisgegevens:</strong> e-mailadres en wachtwoord (versleuteld).</li>
              <li><strong>Account- en gebruiksgegevens:</strong> logingegevens, tijdstippen van gebruik, instellingen, voorkeuren.</li>
              <li><strong>Reflectie- en dagboekgegevens in het G-schema:</strong> door jou ingevoerde gebeurtenissen, gedachten, gevoelens, gedragingen en gevolgen (vrije tekst/keuzevelden).</li>
              <li><strong>Technische gegevens:</strong> IP-adres, browsertype, apparaat-informatie.</li>
              <li><strong>Communicatiegegevens:</strong> berichten die je aan ons stuurt, feedback, supportvragen.</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Wij verwerken in beginsel geen medische dossiers en stellen geen diagnoses; de inhoud die je
              invoert is bedoeld voor zelfreflectie en gedragsverandering. Als jouw invoer toch gevoelige
              gegevens bevat (bijvoorbeeld over gezondheid), behandelen wij die als bijzondere
              persoonsgegevens en beschermen wij deze extra zorgvuldig.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">4. Voor welke doeleinden en op welke grondslagen?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Wij verwerken jouw persoonsgegevens voor de volgende doeleinden en op basis van de volgende rechtsgronden:</p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground leading-relaxed">
              <li>
                <strong>Aanmaken en beheren van je account, aanbieden van het G-schema-platform</strong><br />
                <span className="ml-4">Doel: uitvoering van de overeenkomst. Rechtsgrond: uitvoering van de overeenkomst met jou.</span>
              </li>
              <li>
                <strong>Verbeteren van onze dienst, analyseren van gebruik en performance</strong><br />
                <span className="ml-4">Doel: optimaliseren van functionaliteit, gebruiksvriendelijkheid en veiligheid. Rechtsgrond: gerechtvaardigd belang van doel.io bij het verbeteren van de dienst.</span>
              </li>
              <li>
                <strong>Communicatie over je account, updates en service-berichten</strong><br />
                <span className="ml-4">Doel: informeren over noodzakelijke zaken rond de dienstverlening. Rechtsgrond: uitvoering van de overeenkomst en/of gerechtvaardigd belang.</span>
              </li>
              <li>
                <strong>Voldoen aan wettelijke verplichtingen</strong><br />
                <span className="ml-4">Doel: naleving van wet- en regelgeving. Rechtsgrond: wettelijke verplichting.</span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Wij gebruiken je gegevens niet voor geautomatiseerde besluitvorming die voor jou rechtsgevolgen
              heeft of jou anderszins in aanmerkelijke mate treft.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">5. Cookies en vergelijkbare technieken</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Wij gebruiken geen cookies.</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">6. Met wie delen wij gegevens?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Wij verkopen jouw persoonsgegevens niet. Wij delen gegevens uitsluitend met de volgende
              categorieën ontvangers, voor zover nodig voor onze dienstverlening:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground leading-relaxed">
              <li>Hosting- en clouddienstverleners (voor opslag en beheer van de applicatie en databanken).</li>
              <li>E-mail- en communicatiediensten (voor het verzenden van systeem- en servicemails).</li>
              <li>Analyticstools (voor geanonimiseerde/statistische analyses van gebruik).</li>
              <li>IT-beveiligings- en supportpartijen.</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Met deze partijen sluiten wij verwerkersovereenkomsten waarin is vastgelegd dat zij jouw
              gegevens alleen in onze opdracht mogen verwerken en passende beveiligingsmaatregelen moeten nemen.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">7. Doorgifte buiten de Europese Economische Ruimte (EER)</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Als wij gebruikmaken van dienstverleners buiten de EER, zorgen wij voor een passend
              beschermingsniveau, zoals het gebruik van landen met een adequaatheidsbesluit of het sluiten
              van door de Europese Commissie goedgekeurde standaardcontractbepalingen (SCC&#39;s). Wij geven
              altijd voorkeur aan dienstverleners binnen de EU of binnen de EU gevestigd.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">8. Hoe lang bewaren wij jouw gegevens?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Wij bewaren persoonsgegevens niet langer dan noodzakelijk is voor de doeleinden waarvoor wij
              deze hebben gekregen, tenzij een langere bewaartermijn wettelijk verplicht of toegestaan is.
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground leading-relaxed">
              <li><strong>Account- en gebruiksgegevens:</strong> zolang je een actief account hebt.</li>
              <li><strong>G-schema- en reflectiegegevens:</strong> zolang je account actief is; je kunt deze zelf verwijderen.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">9. Hoe beveiligen wij jouw gegevens?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Wij nemen passende technische en organisatorische maatregelen om je persoonsgegevens te
              beveiligen tegen verlies of enige vorm van onrechtmatige verwerking. Dit omvat onder meer:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground leading-relaxed">
              <li>Versleuteling van data tijdens transport (TLS/HTTPS).</li>
              <li>Beperkte toegang tot gegevens op basis van &#39;need to know&#39;.</li>
              <li>Verplichte 2FA voor inloggen.</li>
              <li>Regelmatige back-ups en monitoring van systemen.</li>
              <li>Periodieke evaluatie van onze beveiligingsmaatregelen.</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Geen enkel systeem is echter 100% beveiligd; wij kunnen absolute veiligheid niet garanderen
              maar streven naar een hoog beschermingsniveau dat past bij de aard van de gegevens.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">10. Jouw rechten</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Je hebt, voor zover de wet dit toestaat, de volgende rechten ten aanzien van je persoonsgegevens:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground leading-relaxed">
              <li>Recht op inzage in de persoonsgegevens die wij van jou verwerken.</li>
              <li>Recht op rectificatie van onjuiste of onvolledige gegevens.</li>
              <li>Recht op verwijdering (&#34;recht op vergetelheid&#34;) van persoonsgegevens.</li>
              <li>Recht op beperking van de verwerking.</li>
              <li>Recht op overdraagbaarheid van gegevens (dataportabiliteit).</li>
              <li>Recht van bezwaar tegen bepaalde verwerkingen, bijvoorbeeld bij direct marketing of verwerkingen op basis van gerechtvaardigd belang.</li>
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Je kunt deze rechten uitoefenen door een verzoek te sturen naar{" "}
              <a href="mailto:doelio.empower111@passmail.net" className="underline hover:text-foreground transition-colors">
                doelio.empower111@passmail.net
              </a>. Wij kunnen je vragen je identiteit te verifiëren om misbruik te voorkomen.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">11. Toestemming intrekken</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Wanneer wij jouw gegevens verwerken op basis van jouw toestemming, heb je het recht deze
              toestemming op ieder moment in te trekken. De verwerking tot aan het moment van intrekking
              blijft rechtmatig.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">12. Klachten en toezichthouder</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Als je vragen of klachten hebt over deze privacyverklaring of over de verwerking van je
              persoonsgegevens, kun je contact met ons opnemen via{" "}
              <a href="mailto:doelio.empower111@passmail.net" className="underline hover:text-foreground transition-colors">
                doelio.empower111@passmail.net
              </a>.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Daarnaast heb je het recht een klacht in te dienen bij de Autoriteit Persoonsgegevens (AP),
              de Nederlandse toezichthouder op het gebied van gegevensbescherming:{" "}
              <a href="https://www.autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">
                www.autoriteitpersoonsgegevens.nl
              </a>.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">13. Wijzigingen in deze privacyverklaring</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Wij kunnen deze privacyverklaring van tijd tot tijd wijzigen, bijvoorbeeld bij wijzigingen in
              onze dienstverlening of in de wet. De meest recente versie is altijd te vinden op{" "}
              <a href="https://doel.io/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">
                https://doel.io/privacy
              </a>; bij ingrijpende wijzigingen informeren wij je via e-mail of via het platform.
            </p>
          </div>

        </div>
      </section>

      <section className="border-t border-border py-8">
        <div className="max-w-3xl mx-auto px-6">
          <Link href="/over" className="text-sm text-muted-foreground hover:text-foreground transition-colors underline">
            ← Terug naar Over doel.io
          </Link>
        </div>
      </section>
    </div>
  );
}

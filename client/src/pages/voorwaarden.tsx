import { Link } from "wouter";

export default function VoorwaardenPage() {
  return (
    <div className="text-foreground">
      <section className="max-w-3xl mx-auto px-6 py-16 md:py-24 space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">Algemene Voorwaarden</h1>
        <p className="text-sm text-muted-foreground">Versie 1.0 — Maart 2026</p>
      </section>

      <div className="max-w-3xl mx-auto px-6 pb-16 space-y-10">

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Artikel 1 — Definities</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">In deze algemene voorwaarden worden de volgende begrippen gehanteerd:</p>
          <ul className="text-sm text-muted-foreground space-y-2 leading-relaxed list-none">
            <li><strong className="text-foreground">doel.io</strong> — de naam en website.</li>
            <li><strong className="text-foreground">Platform</strong> — de web-applicatie en alle bijbehorende functionaliteiten die doel.io via https://doel.io beschikbaar stelt.</li>
            <li><strong className="text-foreground">Gebruiker</strong> — elke natuurlijke persoon die een account aanmaakt en gebruikmaakt van het platform.</li>
            <li><strong className="text-foreground">Abonnement</strong> — de door Gebruiker gekozen betaalde of gratis toegang tot het platform.</li>
            <li><strong className="text-foreground">Overeenkomst</strong> — de overeenkomst die tot stand komt tussen doel.io en Gebruiker op het moment van aanmelden en daarmee accepteren van deze voorwaarden.</li>
            <li><strong className="text-foreground">Inhoud</strong> — door Gebruiker ingevoerde gegevens, teksten en reflecties binnen het G-schema.</li>
            <li><strong className="text-foreground">G-schema</strong> — het Gedachten-Gevoelens-Gedrag-model (Gebeurtenis, Gedachten, Gevoelens, Gedrag, Gevolgen) als interactief zelfhulpinstrument.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Artikel 2 — Toepasselijkheid</h2>
          <div className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <p>2.1 Deze algemene voorwaarden zijn van toepassing op alle aanbiedingen, overeenkomsten en gebruik van het platform van doel.io.</p>
            <p>2.2 Door het aanmaken van een account aanvaardt Gebruiker deze voorwaarden en de privacyverklaring van doel.io.</p>
            <p>2.3 Afwijkingen van deze voorwaarden zijn uitsluitend geldig indien schriftelijk overeengekomen.</p>
            <p>2.4 doel.io behoudt zich het recht voor deze voorwaarden te wijzigen. Ingrijpende wijzigingen worden minimaal 30 dagen van tevoren aangekondigd via e-mail of het platform.</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Artikel 3 — Het platform &amp; de dienst</h2>
          <div className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <p>3.1 doel.io biedt via het platform een digitale omgeving aan waarbinnen Gebruiker op basis van het G-schema zelfstandig kan reflecteren op gedachten, gevoelens, gedrag en de gevolgen hiervan, met als doel persoonlijke gedragsverandering te ondersteunen.</p>
            <p>3.2 Het platform is een zelfhulpinstrument en uitdrukkelijk géén medische, psychologische of therapeutische behandeling. Zie ook de disclaimer in Artikel 14.</p>
            <p>3.3 doel.io spant zich in het platform beschikbaar te houden maar garandeert geen ononderbroken beschikbaarheid. Bij geplande onderhoudswerkzaamheden stelt doel.io Gebruiker hiervan tijdig op de hoogte.</p>
            <p>3.4 doel.io kan het platform, functionaliteiten of het aanbod te allen tijde aanpassen of uitbreiden.</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Artikel 4 — Account &amp; toegang</h2>
          <div className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <p>4.1 Gebruiker mag slechts één account aanmaken en is verantwoordelijk voor alle activiteiten die via dat account plaatsvinden.</p>
            <p>4.2 Gebruiker houdt zijn inloggegevens strikt geheim en meldt doel.io onmiddellijk als hij vermoedt dat zijn account onbevoegd wordt gebruikt.</p>
            <p>4.3 doel.io kan een account blokkeren of verwijderen indien Gebruiker handelt in strijd met deze voorwaarden of indien dit wettelijk vereist is.</p>
            <p>4.4 Gebruiker dient minimaal 18 jaar oud te zijn om het platform te gebruiken. Jongeren mogen uitsluitend deelnemen met toestemming van een ouder of wettelijk vertegenwoordiger.</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Artikel 5 — Abonnement &amp; betaling</h2>
          <div className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <p>5.1 Gebruik van het platform kan kosteloos (freemium) of tegen een maandelijks/jaarlijks abonnementstarief plaatsvinden. De actuele tarieven zijn te raadplegen op https://doel.io/prijzen. Vooralsnog wordt de dienst gratis aangeboden.</p>
            <p>5.2 Betaling geschiedt vooraf en via de op het platform aangeboden betaalmethoden.</p>
            <p>5.3 Bij niet-tijdige betaling is doel.io gerechtigd de toegang tot het platform op te schorten totdat betaling heeft plaatsgevonden.</p>
            <p>5.4 Prijswijzigingen worden minimaal 30 dagen van tevoren aan Gebruiker meegedeeld. Gebruiker heeft bij een prijsverhoging het recht de overeenkomst te beëindigen tegen de datum van inwerkingtreding.</p>
            <p>5.5 Restitutie bij tussentijdse opzegging is niet van toepassing, tenzij wettelijk anders bepaald (zie ook Artikel 10 inzake herroepingsrecht).</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Artikel 6 — Verplichtingen Gebruiker</h2>
          <div className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <p>6.1 Gebruiker gebruikt het platform uitsluitend voor persoonlijke, niet-commerciële doeleinden, tenzij uitdrukkelijk anders overeengekomen.</p>
            <p>6.2 Gebruiker onthoudt zich van gebruik dat in strijd is met de wet, de openbare orde of goede zeden, dan wel rechten van derden schaadt.</p>
            <p>6.3 Gebruiker is volledig verantwoordelijk voor de inhoud die hij invoert in het platform.</p>
            <p>6.4 Gebruiker mag het platform niet (laten) gebruiken om schadelijke, onrechtmatige of misleidende inhoud in te voeren, het platform of de onderliggende infrastructuur te hacken, overbelasten of anderszins te misbruiken, of derden te benaderen of te schaden.</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Artikel 7 — Intellectueel eigendom</h2>
          <div className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <p>7.1 Alle intellectuele eigendomsrechten op het platform, de content, het ontwerp, de software en de methodieken (waaronder de digitale implementatie van het G-schema) berusten bij doel.io of diens licentiegevers.</p>
            <p>7.2 Gebruiker verkrijgt uitsluitend een persoonlijk, niet-overdraagbaar en niet-sublicentieerbaar recht op gebruik van het platform gedurende de looptijd van het abonnement.</p>
            <p>7.3 Gebruiker behoudt de intellectuele eigendomsrechten op de door hem ingevoerde persoonlijke inhoud. Hij verleent doel.io een beperkte licentie om deze inhoud te verwerken voor zover noodzakelijk voor de levering van de dienst en technische werking van het platform.</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Artikel 8 — Privacy &amp; gegevensbescherming</h2>
          <div className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <p>8.1 doel.io verwerkt persoonsgegevens conform de geldende wet- en regelgeving, waaronder de Algemene Verordening Gegevensbescherming (AVG).</p>
            <p>8.2 Op de verwerking van persoonsgegevens is de{" "}
              <Link href="/privacy" className="underline hover:text-foreground transition-colors">privacyverklaring van doel.io</Link>
              {" "}van toepassing.
            </p>
            <p>8.3 Gebruiker stemt in met de verwerking van zijn persoonsgegevens zoals omschreven in de privacyverklaring.</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Artikel 9 — Beschikbaarheid &amp; onderhoud</h2>
          <div className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <p>9.1 doel.io streeft naar een beschikbaarheid van het platform van minimaal 99% op jaarbasis, exclusief geplande onderhoudsmomenten.</p>
            <p>9.2 doel.io is gerechtigd het platform (tijdelijk) buiten gebruik te stellen voor onderhoud, aanpassingen of verbeteringen. doel.io spant zich in dit buiten gebruikstelling zo kort mogelijk te houden en indien mogelijk vooraf aan te kondigen.</p>
            <p>9.3 doel.io is niet aansprakelijk voor schade als gevolg van tijdelijke onbeschikbaarheid.</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Artikel 10 — Herroepingsrecht (consumenten)</h2>
          <div className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <p>10.1 Als Gebruiker een consument is, heeft hij het recht de overeenkomst binnen 14 dagen na het sluiten daarvan te herroepen, zonder opgave van redenen.</p>
            <p>10.2 Indien Gebruiker uitdrukkelijk heeft verzocht om onmiddellijk gebruik van het platform te beginnen vóór het einde van de herroepingstermijn, vervalt het herroepingsrecht na volledige uitvoering van de dienst.</p>
            <p>10.3 Voor herroeping dient Gebruiker contact op te nemen via het contactformulier op doel.io.</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Artikel 11 — Beëindiging</h2>
          <div className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <p>11.1 Gebruiker kan het abonnement op elk gewenst moment opzeggen via de accountinstellingen. Toegang loopt door tot het einde van de betaalde periode.</p>
            <p>11.2 doel.io kan de overeenkomst met onmiddellijke ingang beëindigen bij ernstige schending van deze voorwaarden of bij faillissement van Gebruiker.</p>
            <p>11.3 Na beëindiging worden de persoonlijke reflectiegegevens van Gebruiker conform de privacyverklaring verwijderd. Gebruiker wordt geadviseerd zijn gegevens voorafgaand aan beëindiging te exporteren.</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Artikel 12 — Aansprakelijkheid</h2>
          <div className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <p>12.1 doel.io aanvaardt geen aansprakelijkheid voor schade die Gebruiker lijdt als gevolg van het gebruik van het platform, tenzij er sprake is van opzet of grove schuld aan de zijde van doel.io.</p>
            <p>12.2 Meer in het bijzonder aanvaardt doel.io geen aansprakelijkheid voor: beslissingen die Gebruiker op basis van zijn reflecties in het platform neemt; onnauwkeurigheid of onvolledigheid van de door Gebruiker ingevoerde inhoud; het niet behalen van persoonlijke doelen of gedragsveranderingen; tijdelijke onbeschikbaarheid van het platform; schade door handelen of nalaten van derden.</p>
            <p>12.3 Indien doel.io ondanks het voorgaande aansprakelijk wordt geacht, is de aansprakelijkheid beperkt tot het bedrag dat Gebruiker in de drie maanden voorafgaand aan de schade-aanbrengst aan abonnementskosten heeft betaald, met een maximum van € 500,-.</p>
            <p>12.4 doel.io is nimmer aansprakelijk voor indirecte schade, gevolgschade, gederfde winst of immateriële schade.</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Artikel 13 — Overmacht</h2>
          <div className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <p>13.1 doel.io is niet gehouden tot nakoming van enige verplichting bij overmacht, waaronder begrepen: storingen bij internetproviders, uitval van hostinginfrastructuur, DDoS-aanvallen, overheidsingrijpen, epidemieën of andere omstandigheden buiten de redelijke macht van doel.io.</p>
          </div>
        </section>

        <section className="space-y-3 border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 rounded-2xl p-5">
          <h2 className="text-xl font-semibold">Artikel 14 — Disclaimer</h2>
          <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
            <p className="font-semibold text-foreground">⚠️ Lees deze disclaimer aandachtig door.</p>
            <p><strong className="text-foreground">14.1 Geen medisch of therapeutisch advies —</strong> Het doel.io-platform en alle informatie, tools en content daarop zijn uitsluitend bedoeld als persoonlijk zelfhulpinstrument ter ondersteuning van zelfreflectie en gedragsverandering. doel.io is géén zorginstelling, géén hulpverlener en géén behandelaar. De informatie en functionaliteiten op het platform vormen géén vervanging van professionele medische, psychologische, psychiatrische of therapeutische hulp, zorg of behandeling.</p>
            <p><strong className="text-foreground">14.2 Geen diagnose —</strong> doel.io stelt geen diagnoses en geeft geen medische adviezen. Aan de inhoud of uitkomsten van het G-schema kan geen diagnostische of therapeutische waarde worden ontleend voor jouw individuele situatie of die van anderen.</p>
            <p><strong className="text-foreground">14.3 Raadpleeg een professional —</strong> Heb je gezondheidsklachten, psychische klachten of twijfels over je geestelijke of lichamelijke gezondheid? Raadpleeg dan altijd een (huis)arts, psycholoog, psychiater of andere gekwalificeerde zorgverlener.</p>
            <p><strong className="text-foreground">14.4 Crisissituaties —</strong> doel.io biedt geen crisisinterventie of 24/7 hulpverlening. Bij acuut gevaar voor jezelf of anderen bel je 112 (spoedeisende hulp) of de huisartsenpost. Je kunt ook contact opnemen met de Zelfmoordlijn via 0800-0113 (24/7, gratis).</p>
            <p><strong className="text-foreground">14.5 Nauwkeurigheid informatie —</strong> Hoewel doel.io streeft naar nauwkeurige en actuele informatie op het platform, garandeert doel.io niet dat alle informatie volledig, juist of actueel is.</p>
            <p><strong className="text-foreground">14.6 Externe links —</strong> Het platform kan verwijzingen bevatten naar externe websites. doel.io is niet verantwoordelijk voor de inhoud of het privacybeleid van die externe websites.</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Artikel 15 — Toepasselijk recht &amp; geschillenbeslechting</h2>
          <div className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <p>15.1 Op deze algemene voorwaarden en de overeenkomst tussen doel.io en Gebruiker is uitsluitend Nederlands recht van toepassing.</p>
            <p>15.2 Geschillen worden in eerste instantie in goed overleg opgelost. Lukt dat niet, dan worden geschillen voorgelegd aan de bevoegde rechter in het arrondissement Amsterdam.</p>
            <p>15.3 Onverminderd het voorgaande heeft een Gebruiker die consument is het recht een klacht in te dienen bij de Autoriteit Consument &amp; Markt (ACM) of via het ODR-platform van de Europese Commissie (ec.europa.eu/consumers/odr).</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Artikel 16 — Slotbepalingen</h2>
          <div className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <p>16.1 Indien een bepaling uit deze voorwaarden nietig of vernietigbaar blijkt, laat dit de overige bepalingen onverlet; de nietige bepaling wordt vervangen door een rechtsgeldige bepaling die het dichtstbij het doel van de oorspronkelijke bepaling ligt.</p>
            <p>16.2 doel.io kan haar rechten en verplichtingen uit de overeenkomst overdragen aan een derde, bijvoorbeeld bij een overname. Gebruiker wordt hierover tijdig geïnformeerd en heeft het recht de overeenkomst te beëindigen als hij hiermee niet instemt.</p>
            <p>16.3 De meest actuele versie van deze algemene voorwaarden is te vinden op https://doel.io/voorwaarden.</p>
          </div>
        </section>

        <div className="border-t border-border pt-8 text-xs text-muted-foreground space-y-1">
          <p>Lees ook onze{" "}
            <Link href="/privacy" className="underline hover:text-foreground transition-colors">privacyverklaring</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

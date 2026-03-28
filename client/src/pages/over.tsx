import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function OverPage() {
  return (
    <div className="text-foreground">
      <section className="max-w-3xl mx-auto px-6 py-16 md:py-24 space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">Over doel.io</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          doel.io is gestart als een passieproject om mensen te helpen met het behalen van lastige doelen.
          Vaak kunnen negatieve patronen in de weg zitten van het behalen van doelen — en je bent je daar
          niet altijd van bewust. doel.io probeert je bewust te maken van deze patronen en ze te doorbreken.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Het is een hulpmiddel en ook zo bedoeld. Zoek altijd professionele hulp als je die nodig hebt.
        </p>
      </section>

      <section className="bg-muted/40 border-y border-border py-16">
        <div className="max-w-3xl mx-auto px-6 space-y-10">
          <h2 className="text-2xl md:text-3xl font-bold">Hoe werkt het G-schema?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Het G-schema is een tool uit de cognitieve gedragstherapie (CGT). Het helpt je om een situatie
            stap voor stap te analyseren: wat gebeurde er, wat dacht je, wat voelde je, hoe reageerde je
            en wat waren de gevolgen?
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { label: "Gebeurtenis", color: "bg-blue-50 border-blue-100 text-blue-800", body: "De feitelijke situatie of het moment. Wat was de aanleiding?" },
              { label: "Gedachten", color: "bg-purple-50 border-purple-100 text-purple-800", body: "Wat schoot er door je hoofd? Welke overtuigingen speelden een rol?" },
              { label: "Gevoelens", color: "bg-rose-50 border-rose-100 text-rose-800", body: "Welke emoties ervaarde je? Hoe sterk waren die gevoelens?" },
              { label: "Gedrag", color: "bg-amber-50 border-amber-100 text-amber-800", body: "Hoe reageerde je? Wat deed je — of liet je bewust na?" },
              { label: "Gevolgen", color: "bg-green-50 border-green-100 text-green-800", body: "Wat was het effect van je gedrag, op jezelf en op anderen?" },
            ].map((item) => (
              <div key={item.label} className={`rounded-2xl border px-5 py-4 space-y-1 ${item.color}`}>
                <p className="font-semibold text-sm">{item.label}</p>
                <p className="text-sm opacity-80 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16 space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold">Waarom is doel.io gemaakt?</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Veel mensen lopen vast op weg naar hun doelen, niet door gebrek aan motivatie, maar door
          onbewuste patronen in denken en gedrag. doel.io biedt een laagdrempelige manier om alvast
          aan de slag te gaan: zelfstandig reflecteren, patronen herkennen en kleine stappen zetten.
        </p>
        <div className="pt-4">
          <Link href="/signup"><Button size="lg">Start met je eerste G-schema</Button></Link>
        </div>
      </section>

      <section className="border-t border-border py-10">
        <div className="max-w-3xl mx-auto px-6 space-y-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Let op:</strong> doel.io is een hulpmiddel en geen vervanging voor professionele
            psychologische of therapeutische zorg.
          </p>
          <p className="text-xs text-muted-foreground">
            Lees onze{" "}
            <Link href="/privacy" className="underline hover:text-foreground transition-colors">
              privacyverklaring
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}

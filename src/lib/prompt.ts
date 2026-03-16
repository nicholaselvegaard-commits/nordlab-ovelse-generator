import type { WizardData } from './types';

const scenarioTypeLabels: Record<string, string> = {
  'maritim-sar': 'Maritim SAR (søk og redning)',
  'oljevern': 'Oljevernaksjon',
  'atom-cbrn': 'Atom/CBRN-hendelse',
  'naturkatastrofe': 'Naturkatastrofe (flom, skred, storm)',
  'industriulykke': 'Industriulykke',
  'skogbrann': 'Skogbrann/storbrann',
  'cyberhendelse': 'Cyberhendelse/hybridtrussel',
  'terror': 'Terrorhendelse/massekadehendelse',
  'sammensatt': 'Sammensatt flerhendelses-scenario',
};

const exerciseFormLabels: Record<string, string> = {
  'tabletop': 'Tabletop/bordøvelse',
  'spillovelse': 'Spilløvelse',
  'kombinert': 'Kombinert tabletop og spilløvelse',
  'fullskala': 'Fullskala planleggingsøvelse',
};

const actorLabels: Record<string, string> = {
  'kommunal-kriseledelse': 'Kommunal kriseledelse (ordfører, kommunedirektør, fagetatssjefer)',
  'politiet-lrs': 'Politiet / Lokal redningssentral (LRS)',
  'hrs': 'Hovedredningssentralen (HRS)',
  'brannvesen': 'Brannvesen',
  'helse-amk': 'Helse og AMK',
  'kystverket': 'Kystverket (miljøberedskap)',
  'iua': 'IUA – Interkommunalt utvalg mot akutt forurensning',
  'statsforvalteren': 'Statsforvalteren',
  'sivilforsvaret': 'Sivilforsvaret',
  'media': 'Media/presse (simulert)',
  'naringsliv': 'Næringsliv/industri',
};

const learningGoalLabels: Record<string, string> = {
  'roller-ansvar': 'Roller og ansvar mellom organisasjoner',
  'samvirke': 'Samvirke og samhandling på tvers av etater',
  'krisekommunikasjon': 'Krisekommunikasjon internt og eksternt',
  'beslutningstaking': 'Beslutningstaking under tidspress og usikkerhet',
  'media-pressekonferanse': 'Mediehåndtering og pressekonferanse',
  'planverk': 'Planverk og prosedyrer i praksis',
  'situasjonsbevissthet': 'Situasjonsbevissthet og felles situasjonsbilde',
};

const specialElementLabels: Record<string, string> = {
  'sosiale-medier': 'Sosiale medier og desinformasjon',
  'pressekonferanse': 'Pressekonferanse',
  'parallelle-hendelser': 'Parallelle/samtidige hendelser',
  'ressursmangel': 'Ressursmangel og kapasitetsutfordringer',
  'internasjonale-aktorer': 'Internasjonale aktører og språkutfordringer',
  'natt-morke': 'Natt/mørke-scenario',
  'ekstremvaer': 'Ekstremvær',
};

const complexityLabels: Record<string, string> = {
  'student': 'Student/grunnleggende nivå',
  'profesjonell': 'Profesjonelt nivå',
  'leder': 'Leder- og strategisk nivå',
};

const durationLabels: Record<string, string> = {
  '2t': '2 timer',
  '4t': '4 timer',
  'halvdag': 'Halvdag (ca. 4-5 timer)',
  'heldag': 'Heldag (ca. 6-8 timer)',
  '2dager': '2 dager',
};

export function buildGenerationPrompt(data: WizardData): string {
  const actors = data.actors.map(a => actorLabels[a]).join('\n- ');
  const goals = data.learningGoals.map(g => learningGoalLabels[g]).join('\n- ');
  const specials = data.specialElements.map(s => specialElementLabels[s]).join('\n- ');

  return `Du er en ekspert på norsk beredskapsøvelsesdesign med dyp kunnskap om:
- DSBs øvingsmetodikk (diskusjonsøvelse, spilløvelse, funksjonsøvelse, fullskalaøvelse)
- Norsk beredskapsorganisering (HRS, LRS, IUA, Kystverket, Statsforvalteren, Sivilforsvaret, AMK)
- Norsk lovverk: Sivilbeskyttelsesloven, Brann- og eksplosjonsvernloven, Forurensningsloven
- Reelle norske hendelser (MS Full City, MV Server, Scandinavian Star, Helge Ingstad)
- Nordlab (Senter for beredskap og samvirke, Nord universitet, Bodø)
- ELS (Enhetlig ledelsessystem) og norsk ICS-tilpasning
- Nødnett og norsk sambandsstruktur
- NOFO, IUA Salten, IUA LoVe og regionalt beredskapsapparat i Nord-Norge

Generer en KOMPLETT og REALISTISK beredskapsøvelse basert på følgende parametre:

## ØVELSESPARAMETRE

**Scenariotype:** ${scenarioTypeLabels[data.scenarioType ?? ''] ?? data.scenarioType}
**Geografisk kontekst:** ${data.geographyFreetext || 'Ikke spesifisert'} (${data.geographyType === 'kyst' ? 'kystkommune' : data.geographyType === 'innland' ? 'innlandskommune' : data.geographyType === 'arktisk' ? 'arktisk/nordnorsk kontekst' : ''})
**Øvingsform:** ${exerciseFormLabels[data.exerciseForm ?? ''] ?? data.exerciseForm}
**Varighet:** ${durationLabels[data.duration ?? ''] ?? data.duration}
**Antall sekvenser:** ${data.sequenceCount}
**Deltakere:** ${data.participantCount} deltakere — ${data.participantGroup}
**Kompleksitetsnivå:** ${complexityLabels[data.complexityLevel ?? ''] ?? data.complexityLevel}

**Involverte aktører og etater:**
- ${actors || 'Ikke spesifisert'}

**Læringsmål:**
- ${goals || 'Ikke spesifisert'}

**Spesielle elementer:**
${specials ? `- ${specials}` : 'Ingen spesielle elementer valgt'}

${data.extraContext ? `**Tilleggsinformasjon fra øvelsesansvarlig:**\n${data.extraContext}` : ''}

## KRAV TIL OUTPUT

Generer øvelsen som et strukturert JSON-objekt med følgende format. Vær SVÆRT DETALJERT og REALISTISK:

\`\`\`json
{
  "tittel": "Navn på øvelsen (kreativt og beskrivende, f.eks. 'Øvelse Kystberedskap' eller 'Øvelse Nordfjord')",
  "undertittel": "Kort beskrivelse av hva øvelsen handler om",
  "dato": "Dato øvelsen foregår i scenario (realistisk dato, ikke i dag)",
  "varighet": "Total øvelsesvarighet",
  "ovingsform": "Beskrivelse av øvingsformen",
  "hensikt": "2-3 setninger om hensikten med øvelsen",
  "laringsmal": [
    "Konkret læringsmål 1",
    "Konkret læringsmål 2",
    "..."
  ],
  "scenarioBeskrivelse": "Detaljert scenario-beskrivelse med spesifikke detaljer: eksakte klokkeslett, stedsnavn, fartøynavn, antall involverte, værforhold, tekniske detaljer. Minimum 300 ord. Skal leses opp som briefing til deltakerne.",
  "bakgrunn": "Bakgrunnsinformasjon deltakerne får på forhånd: relevant lovverk, planverk, organisasjonskart, historisk kontekst",
  "deltakere": "Beskrivelse av hvem som deltar og hvilke roller de representerer",
  "rollekort": [
    {
      "rolle": "Eksakt rolletittel",
      "organisasjon": "Hvilken organisasjon/etat",
      "ansvar": "Hva er dette rollens overordnede ansvar i denne øvelsen",
      "nokkeloppgaver": ["Oppgave 1", "Oppgave 2", "Oppgave 3"],
      "hvemSamvirkesMed": ["Aktør 1", "Aktør 2"]
    }
  ],
  "sekvenser": [
    {
      "nummer": 1,
      "tittel": "Sekvens 1: [Beskrivende navn]",
      "tidspunkt": "Kl. HH:MM–HH:MM",
      "type": "intro|diskusjon|spill|refleksjon|evaluering",
      "situasjonsoppdatering": "Ny informasjon som deltakerne mottar i denne sekvensen. Skal være dramatisk og realistisk.",
      "oppgave": "Hva skal deltakerne gjøre i denne sekvensen",
      "diskusjonssporsmal": [
        "Konkret spørsmål 1?",
        "Konkret spørsmål 2?",
        "Konkret spørsmål 3?"
      ],
      "injects": [
        {
          "tidspunkt": "Kl. HH:MM",
          "kilde": "Hvem sender meldingen (f.eks. 'Politimester i Nordland')",
          "melding": "Eksakt tekst i meldingen",
          "type": "telefon|radio|epost|sosiale-medier|fysisk-person|video"
        }
      ],
      "refleksjonssporsmal": [
        "Refleksjonsspørsmål 1?",
        "Refleksjonsspørsmål 2?"
      ],
      "varighetMinutter": 45
    }
  ],
  "evalueringskriterier": [
    "Evalueringskriterie 1",
    "Evalueringskriterie 2"
  ],
  "vedlegg": [
    "Vedlegg A: Kart over øvelsesområdet",
    "Vedlegg B: Relevante planverk og lovverk"
  ]
}
\`\`\`

## VIKTIGE KRAV TIL REALISME:
1. Bruk EKTE norske stedsnavn, kommunenavn og geografiske detaljer
2. Referer til REELL norsk lovgivning og planverk (Sivilbeskyttelsesloven §X, etc.)
3. Bruk korrekte norske organisasjonsnavn og roller (ikke generaliser)
4. Injects skal være skrevet som ekte meldinger, med avsender og eksakt tekst
5. Klokkeslett skal være presise og logisk sekvensert
6. Scenariobeskrivelsen skal ha tekniske detaljer (koordinater, avstand i nm/km, værobservasjoner i m/s)
7. Rollekort skal reflektere reelle norske roller og ansvarslinjer
8. Diskusjonsspørsmål skal utfordre deltakerne på samvirke-dilemmaer og rolleforståelse

Svar KUN med det komplette JSON-objektet, ingen forklaring rundt det.`;
}

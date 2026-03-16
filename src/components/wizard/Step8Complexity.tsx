import type { WizardData, ComplexityLevel, SpecialElement } from '../../lib/types';
import { Check } from 'lucide-react';

interface Props {
  data: WizardData;
  onChange: (updates: Partial<WizardData>) => void;
}

const complexityLevels: { id: ComplexityLevel; label: string; description: string; examples: string }[] = [
  {
    id: 'student',
    label: 'Student / Grunnleggende',
    description: 'Tydelig struktur, forklarende spørsmål, fokus på grunnleggende begreper og rolleavklaring.',
    examples: 'Bachelor/master uten mye praksis, introøvelser',
  },
  {
    id: 'profesjonell',
    label: 'Profesjonelt nivå',
    description: 'Komplekse dilemmaer, realistiske tidsfrister, forventer kjennskap til prosedyrer og lovverk.',
    examples: 'Erfarne beredskapsfolk, øvede kommuneansatte',
  },
  {
    id: 'leder',
    label: 'Leder / Strategisk',
    description: 'Strategiske beslutninger, politisk press, ressursprioritering, mediehåndtering på høyt nivå.',
    examples: 'Ordførere, kommunedirektører, ledere i nødetater',
  },
];

const specialElements: { id: SpecialElement; label: string; description: string }[] = [
  {
    id: 'sosiale-medier',
    label: 'Sosiale medier / desinformasjon',
    description: 'Virale videoer, falske nyheter og rykter som skaper ekstra press',
  },
  {
    id: 'pressekonferanse',
    label: 'Pressekonferanse',
    description: 'Deltakerne gjennomfører en simulert pressekonferanse med journalister',
  },
  {
    id: 'parallelle-hendelser',
    label: 'Parallelle hendelser',
    description: 'To samtidige hendelser som krever delt oppmerksomhet og ressurser',
  },
  {
    id: 'ressursmangel',
    label: 'Ressursmangel',
    description: 'Ressursene strekker ikke til — prioriteringsdilemmaer',
  },
  {
    id: 'internasjonale-aktorer',
    label: 'Internasjonale aktører',
    description: 'Utenlandske statsborgere, utenlandske fartøy, konsulater involvert',
  },
  {
    id: 'natt-morke',
    label: 'Natt / mørke-scenario',
    description: 'Hendelsen skjer om natten med begrensede ressurser og sikt',
  },
  {
    id: 'ekstremvaer',
    label: 'Ekstremvær',
    description: 'Storm, kuling, kraftig snøfall eller andre alvorlige værforhold',
  },
];

export default function Step8Complexity({ data, onChange }: Props) {
  const toggleSpecial = (id: SpecialElement) => {
    const current = data.specialElements;
    const updated = current.includes(id)
      ? current.filter((s) => s !== id)
      : [...current, id];
    onChange({ specialElements: updated });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-900 mb-1">Kompleksitet og tillegg</h2>
      <p className="text-gray-600 mb-6">
        Siste steg — velg ambisjonsnivå og eventuelle tilleggselementer. Skriv gjerne tilleggsinformasjon til AI-en.
      </p>

      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Kompleksitetsnivå</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {complexityLevels.map((c) => {
            const selected = data.complexityLevel === c.id;
            return (
              <button
                key={c.id}
                onClick={() => onChange({ complexityLevel: c.id })}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  selected
                    ? 'border-blue-700 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className={`font-bold text-sm mb-1 ${selected ? 'text-blue-900' : 'text-gray-800'}`}>
                  {c.label}
                </div>
                <p className="text-xs text-gray-500 mb-2">{c.description}</p>
                <p className="text-xs text-gray-400 italic">{c.examples}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Spesielle elementer (valgfritt)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {specialElements.map((s) => {
            const selected = data.specialElements.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => toggleSpecial(s.id)}
                className={`flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                  selected
                    ? 'border-blue-700 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                  selected ? 'bg-blue-700 border-blue-700' : 'border-gray-300'
                }`}>
                  {selected && <Check className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <div className={`text-sm font-semibold ${selected ? 'text-blue-900' : 'text-gray-800'}`}>
                    {s.label}
                  </div>
                  <div className="text-xs text-gray-500">{s.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Tilleggsinformasjon til AI-en</h3>
        <textarea
          value={data.extraContext}
          onChange={(e) => onChange({ extraContext: e.target.value })}
          placeholder="F.eks: 'Øvelsen skal knyttes til pensum om ELS og samvirke. Vi ønsker at IUA Salten spiller en sentral rolle. Unngå at HRS er involvert i denne øvelsen.'"
          rows={4}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm resize-none transition-colors"
        />
        <p className="text-xs text-gray-400 mt-1">
          Skriv spesielle ønsker, begrensninger eller faglig kontekst — AI-en tar dette med i genereringen.
        </p>
      </div>
    </div>
  );
}

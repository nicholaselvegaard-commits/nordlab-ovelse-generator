import type { WizardData, ExerciseForm } from '../../lib/types';

interface Props {
  data: WizardData;
  onChange: (updates: Partial<WizardData>) => void;
}

const forms: { id: ExerciseForm; label: string; description: string; details: string[] }[] = [
  {
    id: 'tabletop',
    label: 'Tabletop / Diskusjonsøvelse',
    description: 'Deltakerne diskuterer scenariet rundt bordet uten å utføre handlinger fysisk.',
    details: [
      'Lavt ressurskrav, enkel gjennomføring',
      'Fokus på roller, ansvar og planverk',
      'Egnet for alle nivåer og størrelser',
      'DSB-kategori: Diskusjonsøvelse',
    ],
  },
  {
    id: 'spillovelse',
    label: 'Spilløvelse',
    description: 'Deltakerne spiller roller og tar beslutninger som i en reell situasjon, med injects og tidspress.',
    details: [
      'Høyere stressfaktor og realisme',
      'Krever rollekort og spillstab',
      'Trener beslutningstaking og kommunikasjon',
      'DSB-kategori: Spilløvelse',
    ],
  },
  {
    id: 'kombinert',
    label: 'Kombinert (tabletop + spilløvelse)',
    description: 'Kombinerer diskusjonsdel med spillsekvenser — slik Nordlab gjennomfører Øvelse Kystberedskap.',
    details: [
      'Best av begge formater',
      'Diskusjon → Spill → Refleksjon-syklus',
      'Nordlabs foretrukne format',
      'Fleksibel tidsstruktur',
    ],
  },
  {
    id: 'fullskala',
    label: 'Fullskala planlegging',
    description: 'Planlegger en fullskalaøvelse med alle operative ressurser. Dokumentet er selve planleggingsgrunnlaget.',
    details: [
      'Høyest ressurskrav og realisme',
      'Krever omfattende koordinering',
      'Egnet for store tverretatlige øvelser',
      'DSB-kategori: Fullskalaøvelse',
    ],
  },
];

export default function Step5ExerciseForm({ data, onChange }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-900 mb-1">Øvingsform</h2>
      <p className="text-gray-600 mb-6">
        Hvordan skal øvelsen gjennomføres? Formen bestemmer struktur, sekvenser og ambisjonsnivå.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {forms.map((f) => {
          const selected = data.exerciseForm === f.id;
          return (
            <button
              key={f.id}
              onClick={() => onChange({ exerciseForm: f.id })}
              className={`p-5 rounded-xl border-2 text-left transition-all duration-200 ${
                selected
                  ? 'border-blue-700 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <div className={`font-bold text-sm mb-2 ${selected ? 'text-blue-900' : 'text-gray-800'}`}>
                {f.label}
              </div>
              <p className="text-xs text-gray-600 mb-3">{f.description}</p>
              <ul className="space-y-1">
                {f.details.map((d, i) => (
                  <li key={i} className="text-xs text-gray-500 flex items-start gap-1.5">
                    <span className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${selected ? 'bg-blue-600' : 'bg-gray-300'}`} />
                    {d}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
    </div>
  );
}

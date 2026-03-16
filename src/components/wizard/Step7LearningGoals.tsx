import type { WizardData, LearningGoal } from '../../lib/types';
import { Check } from 'lucide-react';

interface Props {
  data: WizardData;
  onChange: (updates: Partial<WizardData>) => void;
}

const goals: { id: LearningGoal; label: string; description: string }[] = [
  {
    id: 'roller-ansvar',
    label: 'Roller og ansvar',
    description: 'Forstå egen og andres rolle, ansvarslinjer og mandater på tvers av etater',
  },
  {
    id: 'samvirke',
    label: 'Samvirke og samhandling',
    description: 'Øve på tverretatlig koordinering og felles innsats under en hendelse',
  },
  {
    id: 'krisekommunikasjon',
    label: 'Krisekommunikasjon',
    description: 'Intern og ekstern kommunikasjon i krise — Nødnett, loggføring, meldingshåndtering',
  },
  {
    id: 'beslutningstaking',
    label: 'Beslutningstaking',
    description: 'Ta beslutninger under tidspress, usikkerhet og ressursmangel',
  },
  {
    id: 'media-pressekonferanse',
    label: 'Mediehåndtering',
    description: 'Håndtere pressen, sosiale medier og gjennomføre pressekonferanse',
  },
  {
    id: 'planverk',
    label: 'Planverk i praksis',
    description: 'Bruke kommunale beredskapsplaner, ROS-analyser og nasjonale prosedyrer',
  },
  {
    id: 'situasjonsbevissthet',
    label: 'Situasjonsbevissthet',
    description: 'Bygge felles situasjonsbilde (COP) og opprettholde oversikt i kaos',
  },
];

export default function Step7LearningGoals({ data, onChange }: Props) {
  const toggle = (id: LearningGoal) => {
    const current = data.learningGoals;
    const updated = current.includes(id)
      ? current.filter((g) => g !== id)
      : [...current, id];
    onChange({ learningGoals: updated });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-900 mb-1">Læringsmål</h2>
      <p className="text-gray-600 mb-6">
        Hva skal deltakerne lære og øve på? Velg de viktigste målene — disse styrer diskusjonsspørsmål og refleksjoner.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {goals.map((g) => {
          const selected = data.learningGoals.includes(g.id);
          return (
            <button
              key={g.id}
              onClick={() => toggle(g.id)}
              className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                selected
                  ? 'border-blue-700 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                selected ? 'bg-blue-700 border-blue-700' : 'border-gray-300'
              }`}>
                {selected && <Check className="w-3 h-3 text-white" />}
              </div>
              <div>
                <div className={`text-sm font-semibold ${selected ? 'text-blue-900' : 'text-gray-800'}`}>
                  {g.label}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{g.description}</div>
              </div>
            </button>
          );
        })}
      </div>

      {data.learningGoals.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <span className="text-xs text-blue-700 font-medium">
            {data.learningGoals.length} læringsmål valgt
          </span>
        </div>
      )}
    </div>
  );
}

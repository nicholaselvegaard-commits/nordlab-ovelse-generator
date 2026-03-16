import type { WizardData, ParticipantGroup } from '../../lib/types';
import { Users } from 'lucide-react';

interface Props {
  data: WizardData;
  onChange: (updates: Partial<WizardData>) => void;
}

const groups: { id: ParticipantGroup; label: string; description: string }[] = [
  {
    id: 'bachelor-studenter',
    label: 'Bachelorstudenter',
    description: 'Studenter tidlig i utdanningsløpet, fokus på grunnleggende begreper og roller',
  },
  {
    id: 'master-studenter',
    label: 'Masterstudenter',
    description: 'Studenter i Master i Beredskap og Kriseledelse, faglig dybde forventet',
  },
  {
    id: 'fagprofesjonelle',
    label: 'Fagprofesjonelle',
    description: 'Erfarne beredskapsfolk fra etater, kommuner eller næringsliv',
  },
  {
    id: 'kommuneledelse',
    label: 'Kommuneledelse',
    description: 'Ordførere, rådmenn, kommunedirektører og andre ledere på kommunalt nivå',
  },
  {
    id: 'blanding',
    label: 'Blandet gruppe',
    description: 'Kombinasjon av studenter, fagpersoner og/eller ledere — tverrfaglig sammensetning',
  },
];

export default function Step4Participants({ data, onChange }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-900 mb-1">Deltakere</h2>
      <p className="text-gray-600 mb-6">
        Hvem deltar i øvelsen? Dette påvirker kompleksitet i spørsmål og faglig dybde i scenariet.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {groups.map((g) => {
          const selected = data.participantGroup === g.id;
          return (
            <button
              key={g.id}
              onClick={() => onChange({ participantGroup: g.id })}
              className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                selected
                  ? 'border-blue-700 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <div className={`font-semibold text-sm mb-1 ${selected ? 'text-blue-900' : 'text-gray-800'}`}>
                {g.label}
              </div>
              <div className="text-xs text-gray-500">{g.description}</div>
            </button>
          );
        })}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <Users className="w-4 h-4 inline mr-1" />
          Antall deltakere: <span className="text-blue-700">{data.participantCount}</span>
        </label>
        <input
          type="range"
          min={5}
          max={200}
          step={5}
          value={data.participantCount}
          onChange={(e) => onChange({ participantCount: parseInt(e.target.value) })}
          className="w-full accent-blue-700"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>5</span>
          <span>50</span>
          <span>100</span>
          <span>150</span>
          <span>200</span>
        </div>
      </div>
    </div>
  );
}

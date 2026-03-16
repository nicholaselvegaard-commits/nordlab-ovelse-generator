import type { WizardData, Duration } from '../../lib/types';
import { Clock, Hash } from 'lucide-react';

interface Props {
  data: WizardData;
  onChange: (updates: Partial<WizardData>) => void;
}

const durations: { id: Duration; label: string; description: string; recommendedSequences: number }[] = [
  { id: '2t', label: '2 timer', description: 'Kompakt øvelse, 2–3 sekvenser', recommendedSequences: 2 },
  { id: '4t', label: '4 timer', description: 'Standard øvelse, 3–4 sekvenser', recommendedSequences: 3 },
  { id: 'halvdag', label: 'Halvdag (4–5t)', description: 'Full diskusjonssyklus, 4–5 sekvenser', recommendedSequences: 4 },
  { id: 'heldag', label: 'Heldag (6–8t)', description: 'Komplett øvelse med alle faser, 5–6 sekvenser', recommendedSequences: 5 },
  { id: '2dager', label: '2 dager', description: 'Nordlab-format, dag 1 og dag 2, 6+ sekvenser', recommendedSequences: 6 },
];

export default function Step6Duration({ data, onChange }: Props) {
  const handleDurationChange = (id: Duration, recommended: number) => {
    onChange({ duration: id, sequenceCount: recommended });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-900 mb-1">Varighet og struktur</h2>
      <p className="text-gray-600 mb-6">
        Hvor lang tid har dere til rådighet? Antall sekvenser justeres automatisk, men kan tilpasses.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {durations.map((d) => {
          const selected = data.duration === d.id;
          return (
            <button
              key={d.id}
              onClick={() => handleDurationChange(d.id, d.recommendedSequences)}
              className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                selected
                  ? 'border-blue-700 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Clock className={`w-4 h-4 ${selected ? 'text-blue-700' : 'text-gray-400'}`} />
                <span className={`font-bold text-sm ${selected ? 'text-blue-900' : 'text-gray-800'}`}>
                  {d.label}
                </span>
              </div>
              <p className="text-xs text-gray-500">{d.description}</p>
            </button>
          );
        })}
      </div>

      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          <Hash className="w-4 h-4 inline mr-1" />
          Antall sekvenser: <span className="text-blue-700 font-bold">{data.sequenceCount}</span>
        </label>
        <input
          type="range"
          min={2}
          max={8}
          step={1}
          value={data.sequenceCount}
          onChange={(e) => onChange({ sequenceCount: parseInt(e.target.value) })}
          className="w-full accent-blue-700"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          {[2, 3, 4, 5, 6, 7, 8].map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Hver sekvens inkluderer situasjonsoppdatering, diskusjon/spill og refleksjon.
        </p>
      </div>
    </div>
  );
}

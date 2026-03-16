import type { WizardData, Actor } from '../../lib/types';
import { Check } from 'lucide-react';

interface Props {
  data: WizardData;
  onChange: (updates: Partial<WizardData>) => void;
}

const actors: { id: Actor; label: string; description: string; level: 'lokal' | 'regional' | 'nasjonal' | 'annet' }[] = [
  {
    id: 'kommunal-kriseledelse',
    label: 'Kommunal kriseledelse',
    description: 'Ordfører, kommunedirektør, fagetatssjefer, informasjonsansvarlig',
    level: 'lokal',
  },
  {
    id: 'politiet-lrs',
    label: 'Politiet / LRS',
    description: 'Politidistrikt, Lokal redningssentral, operasjonssentralen',
    level: 'lokal',
  },
  {
    id: 'brannvesen',
    label: 'Brannvesen / 110',
    description: 'Brannsjef, innsatsleder brann, brannmannskaper',
    level: 'lokal',
  },
  {
    id: 'helse-amk',
    label: 'Helse / AMK / 113',
    description: 'Akuttmedisinsk kommunikasjonssenter, ambulanse, kommunelege',
    level: 'lokal',
  },
  {
    id: 'iua',
    label: 'IUA',
    description: 'Interkommunalt utvalg mot akutt forurensning',
    level: 'regional',
  },
  {
    id: 'statsforvalteren',
    label: 'Statsforvalteren',
    description: 'Fylkesmannen, regional koordinering og tilsyn',
    level: 'regional',
  },
  {
    id: 'hrs',
    label: 'HRS',
    description: 'Hovedredningssentralen Nord-Norge (Bodø) eller Sør-Norge (Sola)',
    level: 'nasjonal',
  },
  {
    id: 'kystverket',
    label: 'Kystverket',
    description: 'Miljøberedskap, statlig aksjon ved oljeutslipp, maritim trafikk',
    level: 'nasjonal',
  },
  {
    id: 'sivilforsvaret',
    label: 'Sivilforsvaret',
    description: 'Statlig beredskapsressurs, støtter nødetater',
    level: 'nasjonal',
  },
  {
    id: 'media',
    label: 'Media / Presse (simulert)',
    description: 'NRK, TV2, VG, lokalavis — pressekonferanse og mediehåndtering',
    level: 'annet',
  },
  {
    id: 'naringsliv',
    label: 'Næringsliv / Industri',
    description: 'Havneoperatør, rederier, oljeindustri, NOFO',
    level: 'annet',
  },
];

const levelColors = {
  lokal: 'bg-green-100 text-green-700',
  regional: 'bg-yellow-100 text-yellow-700',
  nasjonal: 'bg-blue-100 text-blue-700',
  annet: 'bg-gray-100 text-gray-600',
};

const levelLabels = {
  lokal: 'Lokalt nivå',
  regional: 'Regionalt nivå',
  nasjonal: 'Nasjonalt nivå',
  annet: 'Annet',
};

export default function Step3Actors({ data, onChange }: Props) {
  const toggle = (id: Actor) => {
    const current = data.actors;
    const updated = current.includes(id)
      ? current.filter((a) => a !== id)
      : [...current, id];
    onChange({ actors: updated });
  };

  const levels = ['lokal', 'regional', 'nasjonal', 'annet'] as const;

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-900 mb-1">Aktører og etater</h2>
      <p className="text-gray-600 mb-6">
        Hvilke organisasjoner er involvert i øvelsen? Velg alle relevante aktører — dette styrer rollekortene og ansvarsfordelingen.
      </p>

      {levels.map((level) => {
        const levelActors = actors.filter((a) => a.level === level);
        return (
          <div key={level} className="mb-5">
            <div className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-3 ${levelColors[level]}`}>
              {levelLabels[level]}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {levelActors.map((actor) => {
                const selected = data.actors.includes(actor.id);
                return (
                  <button
                    key={actor.id}
                    onClick={() => toggle(actor.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                      selected
                        ? 'border-blue-700 bg-blue-50'
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
                        {actor.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{actor.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {data.actors.length > 0 && (
        <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <span className="text-xs text-blue-700 font-medium">
            {data.actors.length} aktør{data.actors.length !== 1 ? 'er' : ''} valgt
          </span>
        </div>
      )}
    </div>
  );
}

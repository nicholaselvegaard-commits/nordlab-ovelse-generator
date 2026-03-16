import type { WizardData, ScenarioType } from '../../lib/types';
import { Anchor, Droplets, Atom, CloudLightning, Factory, Flame, Wifi, AlertTriangle, Layers } from 'lucide-react';

interface Props {
  data: WizardData;
  onChange: (updates: Partial<WizardData>) => void;
}

const scenarios: { id: ScenarioType; label: string; description: string; icon: React.ReactNode }[] = [
  {
    id: 'maritim-sar',
    label: 'Maritim SAR',
    description: 'Søk og redning til sjøs — skipsforlis, cruiseskip, fisker',
    icon: <Anchor className="w-6 h-6" />,
  },
  {
    id: 'oljevern',
    label: 'Oljevernaksjon',
    description: 'Akutt oljeutslipp, kjemikalieutslipp, kystforurensning',
    icon: <Droplets className="w-6 h-6" />,
  },
  {
    id: 'atom-cbrn',
    label: 'Atom / CBRN',
    description: 'Atomdrevne fartøy, radiologisk hendelse, farlige stoffer',
    icon: <Atom className="w-6 h-6" />,
  },
  {
    id: 'naturkatastrofe',
    label: 'Naturkatastrofe',
    description: 'Flom, skred, storm, ekstremvær, tsunami',
    icon: <CloudLightning className="w-6 h-6" />,
  },
  {
    id: 'industriulykke',
    label: 'Industriulykke',
    description: 'Eksplosjon, kjemikalieulykke, industribrann, offshorehendelse',
    icon: <Factory className="w-6 h-6" />,
  },
  {
    id: 'skogbrann',
    label: 'Storbrann',
    description: 'Skogbrann, storbrann i bygg, massevakuasjon',
    icon: <Flame className="w-6 h-6" />,
  },
  {
    id: 'cyberhendelse',
    label: 'Cyber / Hybrid',
    description: 'Cyberangrep, hybrid trussel, infrastrukturangrep',
    icon: <Wifi className="w-6 h-6" />,
  },
  {
    id: 'terror',
    label: 'Terror / Massekade',
    description: 'Terrorhendelse, masseskyteepisode, eksplosjon',
    icon: <AlertTriangle className="w-6 h-6" />,
  },
  {
    id: 'sammensatt',
    label: 'Sammensatt',
    description: 'Flerhendelse — kombinasjon av ulike scenariotyper',
    icon: <Layers className="w-6 h-6" />,
  },
];

export default function Step1ScenarioType({ data, onChange }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-900 mb-1">Hva slags hendelse?</h2>
      <p className="text-gray-600 mb-6">Velg scenariotypen øvelsen skal baseres på.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {scenarios.map((s) => {
          const selected = data.scenarioType === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onChange({ scenarioType: s.id })}
              className={`flex flex-col gap-2 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                selected
                  ? 'border-blue-700 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/30'
              }`}
            >
              <div className={`${selected ? 'text-blue-700' : 'text-gray-500'}`}>
                {s.icon}
              </div>
              <div>
                <div className={`font-semibold text-sm ${selected ? 'text-blue-900' : 'text-gray-800'}`}>
                  {s.label}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{s.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

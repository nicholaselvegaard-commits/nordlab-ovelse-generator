import type { WizardData } from '../../lib/types';
import { MapPin } from 'lucide-react';

interface Props {
  data: WizardData;
  onChange: (updates: Partial<WizardData>) => void;
}

const geographyTypes = [
  {
    id: 'kyst' as const,
    label: 'Kystkommune',
    description: 'Tilgang til hav, fjord, havneanlegg',
    example: 'f.eks. Bodø, Tromsø, Hodneset, Lofoten',
  },
  {
    id: 'innland' as const,
    label: 'Innlandskommune',
    description: 'Elver, innsjøer, fjellterreng, veinettverk',
    example: 'f.eks. Mosjøen, Narvik innland, Alta',
  },
  {
    id: 'arktisk' as const,
    label: 'Arktisk / Nordnorge',
    description: 'Ekstreme forhold, begrenset infrastruktur, polarnatt',
    example: 'f.eks. Svalbard, Barentshavet, Nordkapp',
  },
];

export default function Step2Geography({ data, onChange }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-900 mb-1">Geografisk kontekst</h2>
      <p className="text-gray-600 mb-6">
        Hvor i Norge foregår hendelsen? Vær så spesifikk som mulig — jo mer konkret, jo mer realistisk scenario.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {geographyTypes.map((g) => {
          const selected = data.geographyType === g.id;
          return (
            <button
              key={g.id}
              onClick={() => onChange({ geographyType: g.id })}
              className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                selected
                  ? 'border-blue-700 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/30'
              }`}
            >
              <div className={`font-semibold text-sm mb-1 ${selected ? 'text-blue-900' : 'text-gray-800'}`}>
                {g.label}
              </div>
              <div className="text-xs text-gray-500 mb-1">{g.description}</div>
              <div className="text-xs text-gray-400 italic">{g.example}</div>
            </button>
          );
        })}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <MapPin className="w-4 h-4 inline mr-1" />
          Spesifikk lokasjon / kommune
        </label>
        <input
          type="text"
          value={data.geographyFreetext}
          onChange={(e) => onChange({ geographyFreetext: e.target.value })}
          placeholder="F.eks. Værøy og Røst, Vestfjorden — eller bare 'Nordlandkysten'"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm transition-colors"
        />
        <p className="text-xs text-gray-400 mt-2">
          Tips: Skriv gjerne konkrete stedsnavn — AI-en bruker reelle norske koordinater og geografiske referanser.
        </p>
      </div>
    </div>
  );
}

import type { GeneratedExercise, ExerciseSequence, RoleCard } from '../../lib/types';
import { Clock, Users, Target, FileText, MessageSquare, Zap, CheckSquare, Download } from 'lucide-react';

interface Props {
  exercise: GeneratedExercise;
  onReset: () => void;
}

const sequenceTypeColors = {
  intro: 'bg-gray-100 text-gray-700 border-gray-300',
  diskusjon: 'bg-blue-100 text-blue-800 border-blue-300',
  spill: 'bg-red-100 text-red-800 border-red-300',
  refleksjon: 'bg-green-100 text-green-800 border-green-300',
  evaluering: 'bg-purple-100 text-purple-800 border-purple-300',
};

const sequenceTypeLabels = {
  intro: 'Introduksjon',
  diskusjon: 'Diskusjon',
  spill: 'Spilløvelse',
  refleksjon: 'Refleksjon',
  evaluering: 'Evaluering',
};

const injectTypeIcons = {
  telefon: '📞',
  radio: '📻',
  epost: '📧',
  'sosiale-medier': '📱',
  'fysisk-person': '👤',
  video: '🎥',
};

function SequenceCard({ seq }: { seq: ExerciseSequence }) {
  const typeStyle = sequenceTypeColors[seq.type] || sequenceTypeColors.diskusjon;
  const typeLabel = sequenceTypeLabels[seq.type] || seq.type;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <span className="text-blue-900 font-bold text-lg">Sekvens {seq.nummer}</span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${typeStyle}`}>
            {typeLabel}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {seq.tidspunkt}
          </span>
          <span className="text-gray-300">|</span>
          <span>{seq.varighetMinutter} min</span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-base mb-3">{seq.tittel}</h3>

        {/* Situasjonsoppdatering */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
          <div className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">Situasjonsoppdatering</div>
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{seq.situasjonsoppdatering}</p>
        </div>

        {/* Oppgave */}
        {seq.oppgave && (
          <div className="mb-4">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Oppgave</div>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{seq.oppgave}</p>
          </div>
        )}

        {/* Injects */}
        {seq.injects && seq.injects.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> Injects
            </div>
            <div className="space-y-2">
              {seq.injects.map((inject, i) => (
                <div key={i} className="flex gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <span className="text-base flex-shrink-0">{injectTypeIcons[inject.type] || '📋'}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-600">{inject.kilde}</span>
                      <span className="text-xs text-slate-400">{inject.tidspunkt}</span>
                    </div>
                    <p className="text-sm text-gray-800 italic">"{inject.melding}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Diskusjonsspørsmål */}
        {seq.diskusjonssporsmal && seq.diskusjonssporsmal.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" /> Diskusjonsspørsmål
            </div>
            <ol className="space-y-2">
              {seq.diskusjonssporsmal.map((q, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <span className="font-bold text-blue-700 flex-shrink-0 w-5">{i + 1}.</span>
                  <span>{q}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Refleksjonsspørsmål */}
        {seq.refleksjonssporsmal && seq.refleksjonssporsmal.length > 0 && (
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Refleksjonsspørsmål</div>
            <ul className="space-y-1">
              {seq.refleksjonssporsmal.map((q, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600">
                  <span className="text-green-600 flex-shrink-0">→</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function RoleCardComponent({ role }: { role: RoleCard }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="mb-2">
        <div className="font-bold text-gray-900 text-sm">{role.rolle}</div>
        <div className="text-xs text-blue-700 font-medium">{role.organisasjon}</div>
      </div>
      <p className="text-xs text-gray-600 mb-3">{role.ansvar}</p>
      {role.nokkeloppgaver.length > 0 && (
        <div className="mb-2">
          <div className="text-xs font-semibold text-gray-500 mb-1">Nøkkeloppgaver:</div>
          <ul className="space-y-0.5">
            {role.nokkeloppgaver.map((t, i) => (
              <li key={i} className="text-xs text-gray-600 flex gap-1.5">
                <span className="text-blue-500">•</span>{t}
              </li>
            ))}
          </ul>
        </div>
      )}
      {role.hvemSamvirkesMed.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {role.hvemSamvirkesMed.map((a, i) => (
            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{a}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExerciseDocument({ exercise, onReset }: Props) {
  const handlePrint = () => window.print();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-blue-900 text-white rounded-2xl p-7 mb-6 shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div className="text-xs font-semibold uppercase tracking-widest text-blue-300">
            NORDLAB — Øvelsesdokument
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-lg"
            >
              <Download className="w-3.5 h-3.5" /> Skriv ut / PDF
            </button>
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-lg"
            >
              Ny øvelse
            </button>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-1">{exercise.tittel}</h1>
        <p className="text-blue-200 text-base mb-4">{exercise.undertittel}</p>
        <div className="flex flex-wrap gap-4 text-sm text-blue-100">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> {exercise.varighet}
          </span>
          <span className="flex items-center gap-1.5">
            <FileText className="w-4 h-4" /> {exercise.ovingsform}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4" /> {exercise.deltakere}
          </span>
          {exercise.dato && (
            <span className="flex items-center gap-1.5">
              📅 {exercise.dato}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Hensikt og læringsmål */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-bold text-blue-900 text-lg mb-3 flex items-center gap-2">
            <Target className="w-5 h-5" /> Hensikt og læringsmål
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-4">{exercise.hensikt}</p>
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Læringsmål</div>
            <ul className="space-y-1.5">
              {exercise.laringsmal.map((m, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-blue-600 font-bold flex-shrink-0">{i + 1}.</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Scenariobeskrivelse */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-bold text-blue-900 text-lg mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5" /> Scenariobeskrivelse
          </h2>
          <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">{exercise.scenarioBeskrivelse}</p>
          {exercise.bakgrunn && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Bakgrunnsinformasjon</div>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{exercise.bakgrunn}</p>
            </div>
          )}
        </div>

        {/* Rollekort */}
        {exercise.rollekort && exercise.rollekort.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="font-bold text-blue-900 text-lg mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" /> Rollekort
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {exercise.rollekort.map((role, i) => (
                <RoleCardComponent key={i} role={role} />
              ))}
            </div>
          </div>
        )}

        {/* Sekvenser */}
        <div>
          <h2 className="font-bold text-blue-900 text-lg mb-4 flex items-center gap-2 px-1">
            <Zap className="w-5 h-5" /> Øvelsessekvenser
          </h2>
          <div className="space-y-4">
            {exercise.sekvenser.map((seq) => (
              <SequenceCard key={seq.nummer} seq={seq} />
            ))}
          </div>
        </div>

        {/* Evalueringskriterier */}
        {exercise.evalueringskriterier && exercise.evalueringskriterier.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="font-bold text-blue-900 text-lg mb-3 flex items-center gap-2">
              <CheckSquare className="w-5 h-5" /> Evalueringskriterier
            </h2>
            <ul className="space-y-2">
              {exercise.evalueringskriterier.map((k, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-blue-600 flex-shrink-0">✓</span>
                  <span>{k}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Vedlegg */}
        {exercise.vedlegg && exercise.vedlegg.length > 0 && (
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
            <h2 className="font-bold text-gray-700 text-base mb-3">Vedlegg og ressurser</h2>
            <ul className="space-y-1">
              {exercise.vedlegg.map((v, i) => (
                <li key={i} className="text-sm text-gray-600 flex gap-2">
                  <span className="text-gray-400">📎</span>{v}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Reset */}
        <div className="text-center py-4">
          <button
            onClick={onReset}
            className="bg-blue-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors"
          >
            Generer ny øvelse
          </button>
        </div>
      </div>
    </div>
  );
}

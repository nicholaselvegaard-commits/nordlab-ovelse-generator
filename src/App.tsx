import { useState } from 'react';
import './index.css';
import type { WizardData, GeneratedExercise } from './lib/types';
import { defaultWizardData } from './lib/types';
import { generateExercise } from './lib/generator';
import WizardProgress from './components/wizard/WizardProgress';
import Step1ScenarioType from './components/wizard/Step1ScenarioType';
import Step2Geography from './components/wizard/Step2Geography';
import Step3Actors from './components/wizard/Step3Actors';
import Step4Participants from './components/wizard/Step4Participants';
import Step5ExerciseForm from './components/wizard/Step5ExerciseForm';
import Step6Duration from './components/wizard/Step6Duration';
import Step7LearningGoals from './components/wizard/Step7LearningGoals';
import Step8Complexity from './components/wizard/Step8Complexity';
import ExerciseDocument from './components/output/ExerciseDocument';
import { ChevronLeft, ChevronRight, Loader2, Sparkles, Lock } from 'lucide-react';

const TOTAL_STEPS = 8;

const STEP_TITLES = [
  'Scenariotype',
  'Geografi',
  'Aktører',
  'Deltakere',
  'Øvingsform',
  'Varighet',
  'Læringsmål',
  'Kompleksitet',
];

type AppState = 'gate' | 'wizard' | 'generating' | 'result' | 'error';

function canProceed(step: number, data: WizardData): boolean {
  switch (step) {
    case 1: return data.scenarioType !== null;
    case 2: return true; // Geography is optional
    case 3: return data.actors.length > 0;
    case 4: return data.participantGroup !== null;
    case 5: return data.exerciseForm !== null;
    case 6: return data.duration !== null;
    case 7: return data.learningGoals.length > 0;
    case 8: return data.complexityLevel !== null;
    default: return true;
  }
}

export default function App() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(defaultWizardData);
  const [appState, setAppState] = useState<AppState>('gate');
  const [gateInput, setGateInput] = useState('');
  const [gateError, setGateError] = useState(false);
  const [exercise, setExercise] = useState<GeneratedExercise | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [progressChars, setProgressChars] = useState(0);

  const update = (updates: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleGenerate = async () => {
    setAppState('generating');
    setProgressChars(0);
    try {
      const result = await generateExercise(data, (text) => setProgressChars(text.length));
      setExercise(result);
      setAppState('result');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Ukjent feil';
      if (msg.includes('401') || msg.toLowerCase().includes('passord')) {
        setGateError(true);
        setAppState('gate');
      } else {
        setErrorMsg(msg);
        setAppState('error');
      }
    }
  };

  const handleGate = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem('demo_password', gateInput);
    setAppState('wizard');
    setGateError(false);
  };

  const handleReset = () => {
    setStep(1);
    setData(defaultWizardData);
    setExercise(null);
    setErrorMsg('');
    setAppState('wizard');
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1ScenarioType data={data} onChange={update} />;
      case 2: return <Step2Geography data={data} onChange={update} />;
      case 3: return <Step3Actors data={data} onChange={update} />;
      case 4: return <Step4Participants data={data} onChange={update} />;
      case 5: return <Step5ExerciseForm data={data} onChange={update} />;
      case 6: return <Step6Duration data={data} onChange={update} />;
      case 7: return <Step7LearningGoals data={data} onChange={update} />;
      case 8: return <Step8Complexity data={data} onChange={update} />;
      default: return null;
    }
  };

  // --- Password gate ---
  if (appState === 'gate') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-800 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6 text-blue-800" />
            </div>
            <h1 className="text-xl font-bold text-blue-900">NORDLAB Øvelsesgenerator</h1>
            <p className="text-sm text-gray-500 mt-1">Skriv inn tilgangskoden for å fortsette</p>
          </div>
          <form onSubmit={handleGate} className="space-y-4">
            <input
              type="password"
              value={gateInput}
              onChange={(e) => { setGateInput(e.target.value); setGateError(false); }}
              placeholder="Tilgangskode"
              autoFocus
              className={`w-full px-4 py-3 rounded-xl border-2 text-sm focus:outline-none transition-colors ${
                gateError ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-500'
              }`}
            />
            {gateError && <p className="text-xs text-red-600">Feil tilgangskode</p>}
            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors"
            >
              Logg inn
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Generating screen ---
  if (appState === 'generating') {
    const estimatedTotal = 6000;
    const pct = Math.min(98, Math.round((progressChars / estimatedTotal) * 100));
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-800 flex items-center justify-center px-4">
        <div className="text-center text-white w-full max-w-sm">
          <div className="flex justify-center mb-6">
            <Loader2 className="w-14 h-14 animate-spin text-blue-300" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Genererer øvelse...</h2>
          <p className="text-blue-200 text-sm mb-6">
            AI-en bygger scenario, sekvenser, injects og rollekort.
          </p>
          <div className="w-full bg-white/10 rounded-full h-2 mb-2">
            <div
              className="bg-blue-300 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressChars > 0 ? pct : 5}%` }}
            />
          </div>
          <p className="text-xs text-blue-300">
            {progressChars > 0 ? `${pct}% — ${progressChars} tegn generert` : 'Starter...'}
          </p>
        </div>
      </div>
    );
  }

  // --- Result screen ---
  if (appState === 'result' && exercise) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <ExerciseDocument exercise={exercise} onReset={handleReset} />
      </div>
    );
  }

  // --- Error screen ---
  if (appState === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-red-200 p-8 max-w-md text-center shadow">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-700 mb-2">Generering feilet</h2>
          <p className="text-gray-600 text-sm mb-6">{errorMsg}</p>
          <button
            onClick={handleReset}
            className="bg-blue-900 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-800 transition-colors"
          >
            Prøv igjen
          </button>
        </div>
      </div>
    );
  }

  // --- Wizard screen ---
  const canGoNext = canProceed(step, data);
  const isLastStep = step === TOTAL_STEPS;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50">
      {/* Top bar */}
      <header className="bg-blue-900 text-white px-6 py-4 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-0.5">
              Senter for beredskap og samvirke
            </div>
            <div className="font-bold text-lg">NORDLAB — Øvelsesgenerator</div>
          </div>
          <Sparkles className="w-6 h-6 text-blue-300" />
        </div>
      </header>

      {/* Wizard */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <WizardProgress
          currentStep={step}
          totalSteps={TOTAL_STEPS}
          stepTitles={STEP_TITLES}
        />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 min-h-[420px]">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-300 hover:bg-gray-50 transition-all text-sm"
          >
            <ChevronLeft className="w-4 h-4" /> Tilbake
          </button>

          {isLastStep ? (
            <button
              onClick={handleGenerate}
              disabled={!canGoNext}
              className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-blue-900 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-800 transition-all shadow-md text-sm"
            >
              <Sparkles className="w-4 h-4" /> Generer øvelse
            </button>
          ) : (
            <button
              onClick={nextStep}
              disabled={!canGoNext}
              className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-blue-900 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-800 transition-all shadow-md text-sm"
            >
              Neste <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {!canGoNext && (
          <p className="text-center text-xs text-gray-400 mt-3">
            {step === 1 && 'Velg en scenariotype for å fortsette'}
            {step === 3 && 'Velg minst én aktør for å fortsette'}
            {step === 4 && 'Velg deltakergruppe for å fortsette'}
            {step === 5 && 'Velg øvingsform for å fortsette'}
            {step === 6 && 'Velg varighet for å fortsette'}
            {step === 7 && 'Velg minst ett læringsmål for å fortsette'}
            {step === 8 && 'Velg kompleksitetsnivå for å generere'}
          </p>
        )}
      </main>
    </div>
  );
}

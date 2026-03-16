export type ScenarioType =
  | 'maritim-sar'
  | 'oljevern'
  | 'atom-cbrn'
  | 'naturkatastrofe'
  | 'industriulykke'
  | 'skogbrann'
  | 'cyberhendelse'
  | 'terror'
  | 'sammensatt';

export type ExerciseForm =
  | 'tabletop'
  | 'spillovelse'
  | 'kombinert'
  | 'fullskala';

export type ComplexityLevel = 'student' | 'profesjonell' | 'leder';

export type Duration = '2t' | '4t' | 'halvdag' | 'heldag' | '2dager';

export type Actor =
  | 'kommunal-kriseledelse'
  | 'politiet-lrs'
  | 'hrs'
  | 'brannvesen'
  | 'helse-amk'
  | 'kystverket'
  | 'iua'
  | 'statsforvalteren'
  | 'sivilforsvaret'
  | 'media'
  | 'naringsliv';

export type LearningGoal =
  | 'roller-ansvar'
  | 'samvirke'
  | 'krisekommunikasjon'
  | 'beslutningstaking'
  | 'media-pressekonferanse'
  | 'planverk'
  | 'situasjonsbevissthet';

export type SpecialElement =
  | 'sosiale-medier'
  | 'pressekonferanse'
  | 'parallelle-hendelser'
  | 'ressursmangel'
  | 'internasjonale-aktorer'
  | 'natt-morke'
  | 'ekstremvaer';

export type ParticipantGroup =
  | 'bachelor-studenter'
  | 'master-studenter'
  | 'fagprofesjonelle'
  | 'kommuneledelse'
  | 'blanding';

export interface WizardData {
  scenarioType: ScenarioType | null;
  geographyFreetext: string;
  geographyType: 'kyst' | 'innland' | 'arktisk' | '';
  actors: Actor[];
  participantGroup: ParticipantGroup | null;
  participantCount: number;
  exerciseForm: ExerciseForm | null;
  duration: Duration | null;
  sequenceCount: number;
  learningGoals: LearningGoal[];
  complexityLevel: ComplexityLevel | null;
  specialElements: SpecialElement[];
  extraContext: string;
}

export const defaultWizardData: WizardData = {
  scenarioType: null,
  geographyFreetext: '',
  geographyType: '',
  actors: [],
  participantGroup: null,
  participantCount: 20,
  exerciseForm: null,
  duration: null,
  sequenceCount: 4,
  learningGoals: [],
  complexityLevel: null,
  specialElements: [],
  extraContext: '',
};

// Output types
export interface ExerciseSequence {
  nummer: number;
  tittel: string;
  tidspunkt: string;
  type: 'diskusjon' | 'spill' | 'refleksjon' | 'intro' | 'evaluering';
  situasjonsoppdatering: string;
  oppgave: string;
  diskusjonssporsmal: string[];
  injects?: ExerciseInject[];
  refleksjonssporsmal?: string[];
  varighetMinutter: number;
}

export interface ExerciseInject {
  tidspunkt: string;
  kilde: string;
  melding: string;
  type: 'telefon' | 'radio' | 'epost' | 'sosiale-medier' | 'fysisk-person' | 'video';
}

export interface RoleCard {
  rolle: string;
  organisasjon: string;
  ansvar: string;
  nokkeloppgaver: string[];
  hvemSamvirkesMed: string[];
}

export interface GeneratedExercise {
  tittel: string;
  undertittel: string;
  dato: string;
  varighet: string;
  ovingsform: string;
  hensikt: string;
  laringsmal: string[];
  scenarioBeskrivelse: string;
  bakgrunn: string;
  deltakere: string;
  rollekort: RoleCard[];
  sekvenser: ExerciseSequence[];
  evalueringskriterier: string[];
  vedlegg: string[];
}

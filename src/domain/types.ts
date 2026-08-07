/* ============================================================
   CAREER MODE '26 - domain types (shared contracts)
   ============================================================ */

export type PositionId = 'ST' | 'CF' | 'LW' | 'RW' | 'CAM' | 'CM' | 'CDM' | 'LM' | 'RM' | 'CB' | 'LB' | 'RB' | 'GK';

export type Tier = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface Player {
  name: string;
  number: number;
  position: PositionId;
  countryId: string;
  isGK: boolean;
  stats: Record<string, number>;
  potential: number;
  age: number;
  ovr: number;
  tier: Tier;
  value: number;
  salary: number;
  hype: number;
  stamina: number;
  morale: number;
  reputation: number;
  loyalty: number;
  peakOvr: number;
  peakOvrYear: number;
  peakValue: number;
  peakValueYear: number;
  initialCountryId?: string;
  earnedNationalities?: string[];
}

export interface Club {
  cid: string;
  countryId: string;
  countryName: string;
  confed: string;
  league: string;
  cup: string;
  n: string;
  s: number;
  b: string;
}

export interface Contract {
  yearsLeft: number;
  totalYears: number;
  annualSalary: number;
  isLoan: boolean;
}

export interface ClubStint {
  cid: string;
  seasons: number;
  apps: number;
  goals: number;
  assists: number;
  saves: number;
  conceded: number;
  cleanSheets: number;
  firstYear: number;
  lastYear: number;
  trophies: Trophy[];
  salaries: number[];
}

export interface Trophy {
  type: 'League' | 'Cup' | 'Continental' | 'Country';
  name: string;
}

export interface SeasonResult {
  year: number;
  age: number;
  cid: string;
  clubName: string;
  countryId: string;
  league: string;
  loan: boolean;
  apps: number;
  injured: boolean;
  goals: number;
  assists: number;
  saves: number;
  conceded: number;
  cleanSheets: number;
  rating: number;
  trophies: Trophy[];
  caps: number;
  ntGoals: number;
  salary: number;
  stamina: number;
  morale: number;
  ovrBefore: number;
  ovrAfter: number;
  valueAfter: number;
  hypeBefore: number;
  hypeAfter: number;
  hypeDelta: number;
  repBefore: number;
  repAfter: number;
  repDelta: number;
  agentSpent: number;
  shopSpent: number;
  awards: Award[];
  statLog: Record<string, number>;
  notes: string[];
  nextOffers?: ClubOffer[];
  retired?: boolean;
}

export interface Award {
  id: string;
  name: string;
  icon: string;
  year?: number;
}

export interface ClubOffer {
  type: 'stay' | 'transfer' | 'loan' | 'return' | 'released';
  club: Club;
  fee: number | null;
  roleKey: string;
  role: string;
  noteKey: string;
  note: string;
  noteParams?: Record<string, string>;
  isRenewal?: boolean;
  isLoanBuyout?: boolean;
  contractYears?: number;
}

export interface DecisionOption {
  id: string;
  label: string;
  sub?: string;
  out?: string;
  fx?: EffectFx;
  mini?: MiniGame;
}

export interface EffectFx {
  stats?: Record<string, number>;
  form?: number;
  hype?: number;
  stam?: number;
  mor?: number;
  rep?: number;
  loyalty?: number;
  money?: number;
  injury?: number;
  special?: string;
  risk?: {
    p: number;
    good: EffectFx;
    bad: EffectFx;
  };
}

export interface MiniGame {
  type: 'penalty' | 'timing' | 'gk_penalty';
  zones?: number;
  goodZones?: number;
  results: Record<string, { out: string; fx?: EffectFx }>;
}

export interface DecisionDefinition {
  id: string;
  min: number;
  max: number;
  pos?: 'any' | 'gk' | 'field' | 'att' | 'mid' | 'def' | PositionId[];
  rarity?: string;
  title: string;
  desc: string;
  a?: DecisionOption;
  b?: DecisionOption;
  c?: DecisionOption;
  options?: Array<{ id: string; text: string; sub?: string; out?: string; changes?: Array<{ k: string; d: number }> }>;
  requiresNt?: boolean;
  requiresTournament?: boolean;
}

export type Phase =
  | { kind: 'academy'; options: AcademyOption[] | null }
  | { kind: 'decision'; card: DecisionDefinition | null }
  | { kind: 'booster'; options: Booster[] | null }
  | { kind: 'club'; offers: ClubOffer[] | null }
  | { kind: 'simulating' }
  | { kind: 'season-summary'; result: SeasonResult | null; next: Phase }
  | { kind: 'retired' };

export interface AcademyOption {
  cid: string;
  club: Club;
  role: string;
  note: string;
  roleKey: string;
  noteKey: string;
  rare: boolean;
}

export interface Booster {
  id: string;
  rarity: 'bronze' | 'silver' | 'gold' | 'diamond';
  pos: 'any' | 'gk' | 'field';
  title: string;
  desc: string;
  fx: Record<string, number>;
  fxGk?: Record<string, number>;
}

export type Overlay = 'none' | 'naturalization' | 'national-team';

export type PendingEffect =
  | { type: 'naturalization'; countryId: string }
  | { type: 'nt-callup'; countryCode: string };

export interface SessionState {
  phase: Phase;
  overlay: Overlay;
  pendingEffects: PendingEffect[];
}

export interface CareerTotals {
  apps: number;
  goals: number;
  assists: number;
  saves: number;
  conceded: number;
  cleanSheets: number;
  caps: number;
  ntGoals: number;
  ntCleanSheets: number;
}

export interface CareerState {
  version: number;
  player: Player;
  season: number;
  session: SessionState;
  club: { cid: string; loan: boolean; parentCid: string | null } | null;
  contract?: Contract | null;
  pendingForm: number;
  pendingNotes: string[];
  seasonStatLog: Record<string, number>;
  history: SeasonResult[];
  usedDecisions: string[];
  boostPity: number;
  totals: CareerTotals;
  clubStints: Record<string, ClubStint>;
  ntTrophies: Array<{ name: string; year: number }>;
  earnings: number;
  spent: number;
  retired: boolean;
  retireType: string | null;
  recentOffers: string[];
  awards: Award[];
  [key: string]: unknown;
}

export interface SaveEnvelope {
  schemaVersion: number;
  savedAt: string;
  gameVersion: string;
  state: CareerState;
}

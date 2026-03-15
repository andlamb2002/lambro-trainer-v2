export type SessionState = {
    sessions: Session[];
    activeSessionId: string;
}

export type RecapState = {
    isActive: boolean;
    queue: Case[];
    index: number;
    progress: number;
    total: number;
    solveIds: string[];
}

export type Session = {
    id: string;
    label: string;
    setId: string;
    toggles: CaseToggles;
    solves: Solve[];
    recapState: RecapState | null;
}

export type AlgSet = {
    id: string;
    label: string;
    cases: Case[];
    subsets?: Subset[]; 
}

export type Subset = {
    id: string;
    set: string;
    img: string;
}

export type Case = {
    id: string;
    set: string;
    label: string;
    scrambles: string[];
    originalAlg: string; 
    img: string;
    subset?: string;
    variant?: number;
}

export type CaseToggles = Record<string, boolean>;

export type Solve = {
    id: string;
    caseId: string;
    label: string;
    originalAlg: string;
    scramble: string;
    img: string;
    time: number;
    subset?: string;
    variant?: number;
}


export type Session = {
    name: string;
    setId: string;
    toggles: CaseToggles;
    solves: Solve[];
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
    label: string;
    originalAlg: string;
    scramble: string;
    img: string;
    time: number;
    subset?: string;
    variant?: number;
}


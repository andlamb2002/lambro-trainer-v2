export type Session = {
    name: string;
    set: string;
    cases: Case[];
}

export type Case = {
    id: string;
    set: string;
    label: string;
    scrambles: string[];
    originalAlg: string; 
    img: string;
    enabled: boolean;
    subset?: number;
}

export type Solve = {
    id: string;
    label: string;
    originalAlg: string;
    scramble: string;
    img: string;
    time: number;
    subset?: number;
}


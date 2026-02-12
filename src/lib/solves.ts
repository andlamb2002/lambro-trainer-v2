import type { Case, Solve } from "../types/types";

export function createSolve(currentCase: Case, scramble: string, time?: number): Solve {
    const solve: Solve = {
        id: `${currentCase.id}-${Date.now()}`,
        label: currentCase.label,
        originalAlg: currentCase.originalAlg,
        scramble: scramble,
        img: currentCase.img,
        time: time ?? 0,
        subset: currentCase.subset ?? undefined,
    };
    return solve;
}

export function appendSolve(solves: Solve[], solve: Solve): Solve[] {
    return [...solves, solve];
}
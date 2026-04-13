import type { Case, Solve } from "../types/types";
import { removeLastUMove } from "./format";

export function createSolve(currentCase: Case, scramble: string, time: number): Solve {
    const solve: Solve = {
        id: `${currentCase.id}-${Date.now()}`,
        caseId: currentCase.id,
        label: currentCase.label,
        originalAlg: removeLastUMove(currentCase.originalAlg),
        scramble: scramble,
        img: currentCase.img,
        time: time,
        subset: currentCase.subset ?? undefined,
        variant: currentCase.variant ?? undefined,
    };
    return solve;
}

export function appendSolve(solves: Solve[], solve: Solve): Solve[] {
    return [...solves, solve];
}

export function deleteSolve(solves: Solve[], solveId: string): Solve[] {
    return solves.filter(solve => solve.id !== solveId);
}

export function deleteAllSolves(): Solve[] {
    return [];
}
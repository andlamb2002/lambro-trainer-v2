import type { Case, Subset, AlgSet } from '../types/types'

import zbllCases from './zbll_cases.json'
import zbllSubsets from './zbll_subsets.json'
import pllCases from './pll_cases.json'

export const ALG_SETS: Record<string, AlgSet> = {
    zbll: {
        id: "ZBLL",
        label: "ZBLL",
        cases: zbllCases as Case[],
        subsets: zbllSubsets as Subset[],
    },
    pll: {
        id: "PLL",
        label: "PLL",
        cases: pllCases as Case[],
    }
}

export function getAlgSet(id: string): AlgSet {
    return ALG_SETS[id];
}

export function getAllAlgSets(): AlgSet[] {
    return Object.values(ALG_SETS);
}
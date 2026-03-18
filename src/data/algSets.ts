import type { Case, Subset, AlgSet } from '../types/types'

import zbllCases from './zbll_cases.json'
import zbllSubsets from './zbll_subsets.json'
import pllCases from './pll_cases.json'
import ollCases from './oll_cases.json'

export const ALG_SETS: Record<string, AlgSet> = {
    zbll: {
        id: "zbll",
        label: "zbll",
        cases: zbllCases as Case[],
        subsets: zbllSubsets as Subset[],
    },
    pll: {
        id: "pll",
        label: "pll",
        cases: pllCases as Case[],
    },
    oll: {
        id: "oll",
        label: "oll",
        cases: ollCases as Case[],
    }
}

export function getAlgSet(id: string): AlgSet {
    const set = ALG_SETS[id];
    if (!set) {
        throw new Error(`Alg set with id "${id}" not found.`);
    }
    return set;
}

export function getAllAlgSets(): AlgSet[] {
    return Object.values(ALG_SETS);
}
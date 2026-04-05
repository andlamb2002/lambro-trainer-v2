import type { Case, Subset, AlgSet } from '../types/types'

import zbllCases from './zbll_cases.json'
import zbllSubsets from './zbll_subsets.json'
import ollcpCases from './ollcp_cases.json'
import ollcpSubsets from './ollcp_subsets.json'
import pllCases from './pll_cases.json'
import ollCases from './oll_cases.json'

export const ALG_SETS: Record<string, AlgSet> = {
    pll: {
        id: "pll",
        label: "PLL",
        cases: pllCases as Case[],
    },
    oll: {
        id: "oll",
        label: "OLL",
        cases: ollCases as Case[],
    },
    ollcp: {
        id: "ollcp",
        label: "OLLCP",
        cases: ollcpCases as Case[],
        subsets: ollcpSubsets as Subset[],
    },
    zbll: {
        id: "zbll",
        label: "ZBLL",
        cases: zbllCases as Case[],
        subsets: zbllSubsets as Subset[],
    },
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
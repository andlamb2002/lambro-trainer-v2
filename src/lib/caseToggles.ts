import type { Case, CaseToggles } from '../types/types';

export function setInitialToggles(cases: Case[]): CaseToggles {
    const toggles: CaseToggles = {};
    for (const c of cases) {
        toggles[c.id] = true;
    }
    return toggles;
}

export function toggleAll(toggles: CaseToggles, enabled: boolean): CaseToggles {
    const next: CaseToggles = {};
    for (const id of Object.keys(toggles)) {
        next[id] = enabled;
    }
    return next;
}

export function toggle(toggles: CaseToggles, caseId: string): CaseToggles {
    return {
        ...toggles,
        [caseId]: !toggles[caseId],
    };
}

export function getEnabledCases(cases: Case[], toggles: CaseToggles): Case[] {
    return cases.filter(c => toggles[c.id] === true);
}
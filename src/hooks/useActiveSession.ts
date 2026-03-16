import { useMemo } from 'react'

import { useSessionStore } from '../TimerPage/Stores/useSessionStore';
import { getAlgSet } from '../data/algSets';
import { getEnabledCases } from '../lib/caseToggles';

export function useActiveSession() {
    const sessions = useSessionStore(s => s.sessions);
    const activeSessionId = useSessionStore(s => s.activeSessionId);

    const activeSession = sessions.find(s => s.id === activeSessionId) ?? sessions[0];
    const activeSetKey = activeSession.setId;
    const algSet = getAlgSet(activeSetKey);
    const cases = algSet.cases;
    const subsets = algSet.subsets;
    const toggles = activeSession.toggles;
    const enabledCases = useMemo(() =>
        getEnabledCases(cases, toggles),
        [cases, toggles]
    );
    const solves = activeSession.solves;
    const recapState = activeSession.recapState;

    return {
        activeSession,
        activeSetKey,
        cases,
        subsets,
        toggles,
        enabledCases,
        solves,
        recapState,
    }
}
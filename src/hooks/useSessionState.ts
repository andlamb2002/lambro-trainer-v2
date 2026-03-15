import { useState, useEffect, useMemo } from 'react';

import type { SessionState, CaseToggles, Solve, RecapState } from '../types/types'

import { createSession, updateSessionSet, updateSessionToggles, updateSessionSolves, updateSessionRecapState } from '../lib/sessions'
import { saveSessionState, loadSessionState } from '../lib/storage'
import { getAlgSet } from '../data/algSets'

export function useSessionState() {
    const [sessionState, setSessionState] = useState<SessionState>(() => loadSessionState());
    
    const sessions =  sessionState.sessions;
    const activeSessionId =  sessionState.activeSessionId;

    const activeSession = sessions.find(s => s.id === activeSessionId) ?? sessions[0];
    const activeSetKey = activeSession?.setId ?? "zbll";
    const activeAlgSet = getAlgSet(activeSetKey);
    const cases = activeAlgSet.cases;
    const subsets = activeAlgSet.subsets;
    const solves = activeSession.solves;

    const enabledCases = useMemo(() => {
        return cases.filter(c => activeSession.toggles[c.id] === true);
    }, [cases, activeSession.toggles]);

    const recapState = activeSession.recapState;

    const setActiveSessionId = (id: string) => {
        setSessionState(prev => ({ ...prev, activeSessionId: id }));
    };

    const setToggles = (toggles: CaseToggles) => {
        setSessionState(prev => ({
            ...prev,
            sessions: updateSessionToggles(prev.sessions, prev.activeSessionId, toggles)
        }));
    }

    const addSolve = (solve: Solve) => {
        setSessionState(prev => {
            const current = prev.sessions.find(s => s.id === prev.activeSessionId);
            if (!current) return prev;
            return {
                ...prev,
                sessions: updateSessionSolves(prev.sessions, prev.activeSessionId, [...current.solves, solve])
            }
        });
    };

    const deleteSolve = (id: string) => {
        setSessionState(prev => {
            const current = prev.sessions.find(s => s.id === prev.activeSessionId);
            if (!current) return prev;
            return {
                ...prev,
                sessions: updateSessionSolves(prev.sessions, prev.activeSessionId, current.solves.filter(s => s.id !== id))
            }
        });
    };

    const deleteAllSolves = () => {
        setSessionState(prev => {
            return {
                ...prev,
                sessions: updateSessionSolves(prev.sessions, prev.activeSessionId, [])
            }
        });
    };

    const updateRecap = (recapState: RecapState | null) => {
        setSessionState(prev => {
            return {
                ...prev,
                sessions: updateSessionRecapState(prev.sessions, prev.activeSessionId, recapState)
            }
        });
    }

    const handleNewSession = () => {
        setSessionState(prev => {
            const active = prev.sessions.find(s => s.id === prev.activeSessionId) ?? prev.sessions[0];
            const activeSetKey = active?.setId ?? "zbll";

            const newSession = createSession(`Session ${prev.sessions.length + 1}`, activeSetKey);

            return {
                sessions: [...prev.sessions, newSession],
                activeSessionId: newSession.id,
            };
        });
    };

    const handleChangeSet = (nextSetKey: string) => {
        setSessionState(prev => ({
            ...prev,
            sessions: updateSessionSet(prev.sessions, prev.activeSessionId, nextSetKey),
        }));
    };

    const handleDeleteSession = () => {
        setSessionState(prev => {
            if (prev.sessions.length <= 1) return prev;

            const nextSessions = prev.sessions.filter(s => s.id !== prev.activeSessionId);
            const nextActiveId = nextSessions[0].id;

            return {
                sessions: nextSessions,
                activeSessionId: nextActiveId,
            };
        });
    };

    useEffect(() => {
        saveSessionState(sessionState);
    }, [sessionState]);

    return {
        sessions,
        activeSession,
        activeSessionId,
        activeSetKey,
        cases,
        subsets,
        solves,
        enabledCases,
        recapState,
        setToggles,
        addSolve,
        deleteSolve,
        deleteAllSolves,
        updateRecap,
        handleNewSession,
        handleDeleteSession,
        handleChangeSet,
        setActiveSessionId,
    };
}
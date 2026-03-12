import { useState, useEffect, useMemo } from 'react';

import type { SessionState, CaseToggles, Solve } from '../types/types'

import { createSession, updateSessionSet, updateSessionToggles, updateSessionSolves } from '../lib/sessions'
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
    // const toggles = activeSession.toggles;

    const enabledCases = useMemo(() => {
        return cases.filter(c => activeSession.toggles[c.id] === true);
    }, [cases, activeSession.toggles]);

    const setActiveSessionId = (id: string) => {
        setSessionState(prev => ({ ...prev, activeSessionId: id }));
    };

    const setToggles = (toggles: CaseToggles) => {
        setSessionState(prev => ({
            ...prev,
            sessions: updateSessionToggles(prev.sessions, prev.activeSessionId, toggles)
        }));
    }

    const setSolves: React.Dispatch<React.SetStateAction<Solve[]>> = (next) => {
        setSessionState(prev => {
            const activeId = prev.activeSessionId;

            const prevSolves =
            prev.sessions.find(s => s.id === activeId)?.solves ?? [];

            const nextSolves =
            typeof next === "function" ? next(prevSolves) : next;

            return {
                ...prev,
                sessions: updateSessionSolves(prev.sessions, activeId, nextSolves),
            };
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
        // toggles,
        enabledCases,
        setToggles,
        setSolves,
        handleNewSession,
        handleDeleteSession,
        handleChangeSet,
        setActiveSessionId,
    };
}
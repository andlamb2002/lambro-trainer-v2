import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { CaseToggles, RecapState, SessionState, Solve } from '../types/types'
import { createSession, updateSessionRecapState, updateSessionSet, updateSessionSolves, updateSessionToggles } from '../lib/sessions';

type SessionStore = SessionState & {
    setActiveSessionId: (id: string) => void;
    setToggles: (toggles: CaseToggles) => void;
    addSolve: (solve: Solve) => void;
    getSessionCount: (id: string) => number;
    deleteSolve: (id: string) => void;
    deleteAllSolves: () => void;
    updateRecap: (recapState: RecapState | null) => void;
    handleNewSession: (label: string) => void;
    handleRenameSession: (id: string) => void;
    handleDeleteSession: (id: string) => void;
    handleChangeSet: (nextSetKey: string) => void;
}

const defaultSessions = [
    createSession("1", "pll"),
    createSession("2", "oll"),
    createSession("3", "ollcp"),
    createSession("4", "zbll"),
    createSession("5", "eg"),
];

export const useSessionStore = create<SessionStore>()(
    persist(
        (set, get) => ({
            sessions: defaultSessions,
            activeSessionId: defaultSessions[0]?.id,

            setActiveSessionId: (id: string) => {
                set({ activeSessionId: id });
            },
            setToggles: (toggles: CaseToggles) => {
                set(prev => {
                    const withToggles = updateSessionToggles(prev.sessions, prev.activeSessionId, toggles);
                    const withReset = updateSessionRecapState(withToggles, prev.activeSessionId, null);
                    return { sessions: withReset };
                });
            },
            addSolve: (solve: Solve) => {
                set(prev => {
                    const current = prev.sessions.find(s => s.id === prev.activeSessionId);
                    if (!current) return prev;
                    return {
                        sessions: updateSessionSolves(prev.sessions, prev.activeSessionId, [...current.solves, solve])
                    }
                });
            },
            getSessionCount: (id: string) => {
                const session = get().sessions.find(s => s.id === id);
                if (!session) return 0;
                return Object.values(session.toggles).filter(Boolean).length;
            },
            deleteSolve: (id: string) => {
                set(prev => {
                    const current = prev.sessions.find(s => s.id === prev.activeSessionId);
                    if (!current) return prev;
                    return {
                        sessions: updateSessionSolves(prev.sessions, prev.activeSessionId, current.solves.filter(s => s.id !== id))
                    }
                });
            },
            deleteAllSolves: () => {
                set(prev => {
                    return {
                        sessions: updateSessionSolves(prev.sessions, prev.activeSessionId, [])
                    }
                });
            },
            updateRecap: (recapState: RecapState | null) => {
                set(prev => {
                    return {
                        sessions: updateSessionRecapState(prev.sessions, prev.activeSessionId, recapState)
                    }
                });
            },
            handleNewSession: (label: string) => {
                set(prev => {
                    const active = prev.sessions.find(s => s.id === prev.activeSessionId) ?? prev.sessions[0];
                    const trimmed = label.trim().slice(0, 30);
                    const newSession = createSession(trimmed, active.setId);
                    newSession.toggles = { ...active.toggles };
                    return {
                        sessions: [...prev.sessions, newSession],
                        activeSessionId: newSession.id,
                    };
                });
            },
            handleRenameSession: (id: string) => {
                const session = get().sessions.find(s => s.id === id);
                if (!session) return;
                const newName = window.prompt("Session name:", session.label)?.trim().slice(0, 30);
                if (!newName) return;
                set(prev => {
                    const updatedSessions = prev.sessions.map(s => {
                        if (s.id === id) {
                            return { ...s, label: newName };
                        }
                        return s;
                    });
                    return { sessions: updatedSessions };
                });
            },
            handleDeleteSession: (id: string) => {
                set(prev => {
                    const updatedSessions = prev.sessions.filter(s => s.id !== id);
                    if(prev.activeSessionId === id) {
                        const newActiveSessionId = updatedSessions[0]?.id ?? "";
                        return {
                            sessions: updatedSessions,
                            activeSessionId: newActiveSessionId,
                        }
                    }

                    return {
                        sessions: updatedSessions,
                    }
                });
            },
            handleChangeSet: (nextSetKey: string) => {
                const active = get().sessions.find(s => s.id === get().activeSessionId);
                const allEnabled = active 
                    ? Object.values(active.toggles).every(Boolean)
                    : true;
                const hasSolves = active ? active.solves.length > 0 : false;
                const needsConfirm = !allEnabled || hasSolves;

                if (!needsConfirm || window.confirm("You will lose your selected cases and solves.")) {
                    set(prev => {
                        const withSet = updateSessionSet(prev.sessions, prev.activeSessionId, nextSetKey);
                        const withSolves = updateSessionSolves(withSet, prev.activeSessionId, []);
                        const withReset = updateSessionRecapState(withSolves, prev.activeSessionId, null);
                        return { sessions: withReset };
                    });
                }
            },
        }),
        {name: "session_state"}
    )
);

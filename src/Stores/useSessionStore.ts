import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { CaseToggles, RecapState, SessionState, Solve } from '../types/types'
import { createSession, updateSessionRecapState, updateSessionSet, updateSessionSolves, updateSessionToggles } from '../lib/sessions';

type SessionStore = SessionState & {
    setActiveSessionId: (id: string) => void;
    setToggles: (toggles: CaseToggles) => void;
    addSolve: (solve: Solve) => void;
    deleteSolve: (id: string) => void;
    deleteAllSolves: () => void;
    updateRecap: (recapState: RecapState | null) => void;
    handleNewSession: () => void;
    handleDeleteSession: (id: string) => void;
    handleChangeSet: (nextSetKey: string) => void;
}

const defaultSession = createSession("Session 1", "zbll");

export const useSessionStore = create<SessionStore>()(
    persist(
        (set) => ({
            sessions: [defaultSession],
            activeSessionId: defaultSession.id,

            setActiveSessionId: (id: string) => {
                set({ activeSessionId: id });
            },
            setToggles: (toggles: CaseToggles) => {
                set(prev => ({
                    sessions: updateSessionToggles(prev.sessions, prev.activeSessionId, toggles)
                }));
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
            handleNewSession: () => {
                set(prev => {
                    const active = prev.sessions.find(s => s.id === prev.activeSessionId) ?? prev.sessions[0];
                    const activeSetKey = active?.setId ?? "zbll";

                    const newSession = createSession(`Session ${prev.sessions.length + 1}`, activeSetKey);

                    return {
                        sessions: [...prev.sessions, newSession],
                        activeSessionId: newSession.id,
                    }
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
                if(window.confirm("You will lose the cases you selected.")) {
                    set(prev => ({
                        sessions: updateSessionSet(prev.sessions, prev.activeSessionId, nextSetKey),
                    }));
                }
            },
        }),
        {name: "session_state"}
    )
);

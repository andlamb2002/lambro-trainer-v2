import { useState, useEffect, useMemo } from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'

import TimerPage from './TimerPage/TimerPage'
import CaseSelectPage from './CaseSelectPage/CaseSelectPage'
import TempPage from './TempPage'

import type { SessionState, CaseToggles, Solve } from './types/types'

import { createSession, updateSessionSet, updateSessionToggles, updateSessionSolves } from './lib/sessions'
import { saveSessionState, loadSessionState } from './lib/storage'
import { getAlgSet } from './data/algSets'

function App() {

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

    return (
        <>
            <nav style={{ display: "flex", gap: 8 }}>
                <Link to="/cases">Cases</Link>
                <Link to="/">Timer</Link>
            </nav>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <select
                    value={activeSessionId}
                    onChange={(e) => setActiveSessionId(e.target.value)}
                >
                    {sessions.map(s => (
                        <option key={s.id} value={s.id}>
                            {s.label} ({s.setId})
                        </option>
                    ))}
                </select>

                <button onClick={handleNewSession}>
                    New Session
                </button>

                <button disabled={sessions.length <= 1} onClick={handleDeleteSession}>
                    Delete Session
                </button>

                <div>Selected: {enabledCases.length}</div>
            </div>

            <Routes>
                <Route path="/" 
                    element={
                        <TimerPage 
                            key={activeSessionId} 
                            cases={cases} 
                            toggles={activeSession.toggles} 
                            solves={solves} 
                            setSolves={setSolves} 
                        />
                    } 
                />
                <Route path="/cases" 
                    element={
                        <CaseSelectPage 
                            cases={cases} 
                            subsets={subsets} 
                            toggles={activeSession.toggles} 
                            setToggles={setToggles} 
                            activeSetKey={activeSetKey}
                            handleChangeSet={handleChangeSet}
                        />
                    } 
                />
                <Route path="/temp" element={<TempPage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    )
}

export default App

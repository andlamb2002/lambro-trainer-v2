import { useState } from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'

import TimerPage from './TimerPage/TimerPage'
import CaseSelectPage from './CaseSelectPage/CaseSelectPage'

// import zbllCases from './data/zbll_cases.json'
// import zbllSubsets from './data/zbll_subsets.json'

import type { CaseToggles, Session } from './types/types'

// import { setInitialToggles } from './lib/caseToggles'
import { createSession, updateSessionSet, updateSessionToggles } from './lib/sessions'
import { getAlgSet, getAllAlgSets } from './data/algSets'

type SessionState = {
    sessions: Session[];
    activeSessionId: string;
}

function App() {

    const [ sessionState, setSessionState] = useState<SessionState>(() => {
        const first = createSession("Session 1", "zbll");
        return { sessions: [first], activeSessionId: first.id };
    });

    const sessions =  sessionState.sessions;
    const activeSessionId =  sessionState.activeSessionId;

    const activeSession = sessions.find(s => s.id === activeSessionId) ?? sessions[0];
    const activeSetKey = activeSession?.setId ?? "zbll";

    const activeAlgSet = getAlgSet(activeSetKey);
    const cases = activeAlgSet.cases;
    const subsets = activeAlgSet.subsets;

    // const [toggles, setToggles] = useState<CaseToggles>(() => setInitialToggles(zbllCases));

    const setActiveSessionId = (id: string) => {
        setSessionState(prev => ({ ...prev, activeSessionId: id }));
    };

    const setToggles = (toggles: CaseToggles) => {
        setSessionState(prev => ({
            ...prev,
            sessions: updateSessionToggles(prev.sessions, prev.activeSessionId, toggles)
        }));
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

    const allSets = getAllAlgSets();

    return (
        <>
            <nav style={{ display: "flex", gap: 8 }}>
                <Link to="/">Timer</Link>
                <Link to="/cases">Cases</Link>
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

                <button
                    onClick={handleNewSession}
                >
                    New Session
                </button>

                <button disabled={sessions.length <= 1} onClick={handleDeleteSession}>
                    Delete Session
                </button>

                <select value={activeSetKey} onChange={(e) => handleChangeSet(e.target.value)}>
                    {allSets.map(s => (
                        <option key={s.id} value={s.id.toLowerCase() === "zbll" ? "zbll" : "pll"}>
                            {s.label}
                        </option>
                    ))}
                </select>
            </div>

            <Routes>
                <Route path="/" element={<TimerPage cases={cases} toggles={activeSession.toggles} />} />
                <Route path="/cases" element={<CaseSelectPage cases={cases} subsets={subsets} toggles={activeSession.toggles} setToggles={setToggles} />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    )
}

export default App

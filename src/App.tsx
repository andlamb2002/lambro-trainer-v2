import { useMemo } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom'

import TimerPage from './TimerPage/TimerPage'
import CaseSelectPage from './CaseSelectPage/CaseSelectPage'

import { useSessionStore } from './TimerPage/Stores/useSessionStore'
import { getAlgSet } from './data/algSets';
import { getEnabledCases } from './lib/caseToggles';


function App() {

    const sessions = useSessionStore(s => s.sessions);
    const activeSessionId = useSessionStore(s => s.activeSessionId);
    const setActiveSessionId = useSessionStore(s => s.setActiveSessionId);
    const handleNewSession = useSessionStore(s => s.handleNewSession);
    const handleDeleteSession = useSessionStore(s => s.handleDeleteSession);

    const activeSession = sessions.find(s => s.id === activeSessionId) ?? sessions[0];
    const activeSetKey = activeSession?.setId ?? 'zbll';
    const activeAlgSet = getAlgSet(activeSetKey);
    const cases = activeAlgSet.cases;

    const enabledCases = useMemo(() =>
        getEnabledCases(cases, activeSession.toggles),
        [cases, activeSession.toggles]
    );

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
                        <TimerPage key={activeSessionId} />
                    } 
                />
                <Route path="/cases" 
                    element={
                        <CaseSelectPage />
                    } 
                />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    )
}

export default App

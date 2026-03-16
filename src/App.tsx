import { Routes, Route, Navigate, Link } from 'react-router-dom'

import TimerPage from './TimerPage/TimerPage'
import CaseSelectPage from './CaseSelectPage/CaseSelectPage'

import { useSessionStore } from './Stores/useSessionStore'
import { useActiveSession } from './hooks/useActiveSession';


function App() {

    const sessions = useSessionStore(s => s.sessions);
    const activeSessionId = useSessionStore(s => s.activeSessionId);
    const setActiveSessionId = useSessionStore(s => s.setActiveSessionId);
    const handleNewSession = useSessionStore(s => s.handleNewSession);
    const handleDeleteSession = useSessionStore(s => s.handleDeleteSession);

    const { 
        enabledCases,
    } = useActiveSession();

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

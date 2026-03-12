import { Routes, Route, Navigate, Link } from 'react-router-dom'

import TimerPage from './TimerPage/TimerPage'
import CaseSelectPage from './CaseSelectPage/CaseSelectPage'
import TempPage from './TempPage'

import { useSessionState } from './hooks/useSessionState'

function App() {

    const {
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
    } = useSessionState();

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

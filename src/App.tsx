import { useMemo } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom'

import TimerPage from './TimerPage/TimerPage'
import CaseSelectPage from './CaseSelectPage/CaseSelectPage'

// import { useSessionState } from './hooks/useSessionState'
import { useSessionStore } from './TimerPage/Stores/useSessionStore'
import { getAlgSet } from './data/algSets';


function App() {

    // const {
    //     sessions,
    //     activeSession,
    //     activeSessionId,
    //     activeSetKey,
    //     cases,
    //     subsets,
    //     solves,
    //     enabledCases,
    //     recapState,
    //     setToggles,
    //     addSolve,
    //     deleteSolve,
    //     deleteAllSolves,
    //     updateRecap,
    //     handleNewSession,
    //     handleDeleteSession,
    //     handleChangeSet,
    //     setActiveSessionId,
    // } = useSessionState();

    const sessions = useSessionStore(s => s.sessions);
    const activeSessionId = useSessionStore(s => s.activeSessionId);
    const setActiveSessionId = useSessionStore(s => s.setActiveSessionId);
    const handleNewSession = useSessionStore(s => s.handleNewSession);
    const handleDeleteSession = useSessionStore(s => s.handleDeleteSession);
    const handleChangeSet = useSessionStore(s => s.handleChangeSet);
    const setToggles = useSessionStore(s => s.setToggles);
    const addSolve = useSessionStore(s => s.addSolve);
    const deleteSolve = useSessionStore(s => s.deleteSolve);
    const deleteAllSolves = useSessionStore(s => s.deleteAllSolves);
    const updateRecap = useSessionStore(s => s.updateRecap);

    const activeSession = sessions.find(s => s.id === activeSessionId) ?? sessions[0];
    const activeSetKey = activeSession?.setId ?? 'zbll';
    const activeAlgSet = getAlgSet(activeSetKey);
    const cases = activeAlgSet.cases;
    const subsets = activeAlgSet.subsets;
    const solves = activeSession.solves;
    const enabledCases = useMemo(() =>
        cases.filter(c => activeSession.toggles[c.id] === true),
        [cases, activeSession.toggles]
    );
    const recapState = activeSession.recapState;

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
                            enabledCases={enabledCases}
                            solves={solves} 
                            addSolve={addSolve}
                            deleteSolve={deleteSolve}
                            deleteAllSolves={deleteAllSolves}
                            recapState={recapState}
                            updateRecap={updateRecap}
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
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    )
}

export default App

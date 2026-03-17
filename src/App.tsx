import { Routes, Route, Navigate, Link } from 'react-router-dom'

import Header from './Header'
import TimerPage from './TimerPage/TimerPage'
import CaseSelectPage from './CaseSelectPage/CaseSelectPage'

import { useSessionStore } from './Stores/useSessionStore'

function App() {

    const activeSessionId = useSessionStore(s => s.activeSessionId);

    return (
        <>
            <nav style={{ display: "flex", gap: 8 }}>
                <Link to="/cases">Cases</Link>
                <Link to="/">Timer</Link>
            </nav>

            <Header />

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

import { Routes, Route, Navigate } from 'react-router-dom'

import Header from './Header'
import TimerPage from './TimerPage/TimerPage'
import CaseSelectPage from './CaseSelectPage/CaseSelectPage'

import { useSessionStore } from './Stores/useSessionStore'

function App() {

    const activeSessionId = useSessionStore(s => s.activeSessionId);

    return (
        <div className="flex flex-col min-h-screen bg-primary text-text scrollbar-hide">
            <Header />
            <main className="flex flex-col grow">
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
            </main>
        </div>
    )
}

export default App

import { Routes, Route, Navigate } from 'react-router-dom'

import TimerPage from './pages/TimerPage'
import CaseSelectPage from './pages/CaseSelectPage'

function App() {

    return (
        <>
            <Routes>
                <Route path="/" element={<TimerPage />} />
                <Route path="/cases" element={<CaseSelectPage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    )
}

export default App

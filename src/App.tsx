import { Routes, Route, Navigate } from 'react-router-dom'

import TimerPage from './pages/TimerPage'
import CaseSelectPage from './pages/CaseSelectPage'

import zbllCases from './data/zbll_cases.json'

function App() {

    return (
        <>
            <Routes>
                <Route path="/" element={<TimerPage cases={zbllCases}/>} />
                <Route path="/cases" element={<CaseSelectPage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    )
}

export default App

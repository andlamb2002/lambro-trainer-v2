import { Routes, Route, Navigate, Link } from 'react-router-dom'

import TimerPage from './TimerPage/TimerPage'
import CaseSelectPage from './CaseSelectPage/CaseSelectPage'

import zbllCases from './data/zbll_cases.json'
import zbllSubsets from './data/zbll_subsets.json'

function App() {

    return (
        <>
            <nav style={{ display: "flex", gap: 8 }}>
                <Link to="/">Timer</Link>
                <Link to="/cases">Cases</Link>
            </nav>
            <Routes>
                <Route path="/" element={<TimerPage cases={zbllCases} subsets={zbllSubsets} />} />
                <Route path="/cases" element={<CaseSelectPage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    )
}

export default App

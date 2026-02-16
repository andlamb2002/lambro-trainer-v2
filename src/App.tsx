import { useState } from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'

import TimerPage from './TimerPage/TimerPage'
import CaseSelectPage from './CaseSelectPage/CaseSelectPage'

import zbllCases from './data/zbll_cases.json'
import zbllSubsets from './data/zbll_subsets.json'

import type { CaseToggles } from './types/types'

import { setInitialToggles } from './lib/caseToggles'

function App() {

    const [toggles, setToggles] = useState<CaseToggles>(() => setInitialToggles(zbllCases));

    return (
        <>
            <nav style={{ display: "flex", gap: 8 }}>
                <Link to="/">Timer</Link>
                <Link to="/cases">Cases</Link>
            </nav>
            <Routes>
                <Route path="/" element={<TimerPage cases={zbllCases} toggles={toggles} />} />
                <Route path="/cases" element={<CaseSelectPage cases={zbllCases} subsets={zbllSubsets} toggles={toggles} setToggles={setToggles} />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    )
}

export default App

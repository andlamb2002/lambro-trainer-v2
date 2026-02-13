import { useState } from 'react'

import type { Case, CaseToggles, Solve } from '../types/types'

import { setInitialToggles, setAllCases, getEnabledCases } from '../lib/caseToggles'
import { getRandomCaseAndScramble } from '../lib/randomScramble'
import { createSolve, appendSolve } from '../lib/solves'

type Props = {
    cases: Case[]
}

function TimerPage({ cases }: Props) {
    const [toggles, setToggles] = useState<CaseToggles>(() => setInitialToggles(cases));

    const enabledCases = getEnabledCases(cases, toggles);

    const [{ caseItem: initialCase, scramble: initialScramble }] = useState(() =>
        getRandomCaseAndScramble(cases)
    );
    const [currentCase, setCurrentCase] = useState(initialCase);
    const [currentScramble, setCurrentScramble] = useState(initialScramble);

    const [solves, setSolves] = useState<Solve[]>([]);

    const nextCase = () => {
        if (enabledCases.length === 0) return;

        const solve = createSolve(currentCase, currentScramble);
        setSolves((solves) => appendSolve(solves, solve));

        const {caseItem: c, scramble} = getRandomCaseAndScramble(cases);
        setCurrentCase(c);
        setCurrentScramble(scramble);
    }

    const toggleAll = (enabled: boolean) => {
        setToggles(prev => setAllCases(prev, enabled));
    };

    return (
        <>
            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => toggleAll(true)}>All On</button>
                <button onClick={() => toggleAll(false)}>All Off</button>
                <div>Enabled cases: {enabledCases.length}</div>
            </div>
            <div>{currentCase.label}</div>
            <div>{currentScramble}</div>
            <button onClick={nextCase}>Next</button>

            <ul>
                {solves.map(solve => (
                    <li key={solve.id}> {solve.label} </li>
                ))}
            </ul>
        </>
    )
}

export default TimerPage
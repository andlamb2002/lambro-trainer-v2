import { useState } from 'react'

import type { Case, Solve } from '../types/types'

import { getRandomCaseAndScramble } from '../lib/randomScramble'
import { createSolve, appendSolve } from '../lib/solves'

type Props = {
    cases: Case[]
}

function TimerPage({ cases }: Props) {

    const initial = getRandomCaseAndScramble(cases);
    const [currentCase, setCurrentCase] = useState(initial.case);
    const [currentScramble, setCurrentScramble] = useState(initial.scramble);

    const [solves, setSolves] = useState<Solve[]>([]);

    const nextCase = () => {
        const solve = createSolve(currentCase, currentScramble);
        setSolves((solves) => appendSolve(solves, solve));

        const {case: c, scramble} = getRandomCaseAndScramble(cases);
        setCurrentCase(c);
        setCurrentScramble(scramble);
    }

    return (
        <>
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
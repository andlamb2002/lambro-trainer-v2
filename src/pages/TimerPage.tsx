import { useState } from 'react'

import type { Case, Solve } from '../types/types'

import { getRandomCaseAndScramble } from '../lib/randomScramble'
import { createSolve, appendSolve } from '../lib/solves'

type Props = {
    cases: Case[]
}

function TimerPage({ cases }: Props) {

    const [{ case: initialCase, scramble: initialScramble }] = useState(() =>
        getRandomCaseAndScramble(cases)
    );
    const [currentCase, setCurrentCase] = useState(initialCase);
    const [currentScramble, setCurrentScramble] = useState(initialScramble);

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
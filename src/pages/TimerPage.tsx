import { useState } from 'react'

import type { Case } from '../types/types'

import { getRandomCaseAndScramble } from '../lib/randomScramble'

type Props = {
    cases: Case[]
}

function TimerPage({ cases }: Props) {

    const initial = getRandomCaseAndScramble(cases);
    const [currentCase, setCurrentCase] = useState(initial.case);
    const [currentScramble, setCurrentScramble] = useState(initial.scramble);

    const nextCase = () => {
        const {case: c, scramble} = getRandomCaseAndScramble(cases);
        setCurrentCase(c);
        setCurrentScramble(scramble);
    }

    return (
        <>
            <div>{currentCase.label}</div>
            <div>{currentScramble}</div>
            <button onClick={nextCase}>Next</button>
        </>
    )
}

export default TimerPage
import { useState } from 'react'

import type { Case, CaseToggles, Solve } from '../types/types'
// import { useCaseStore } from './Stores/useCaseStore'

import { getEnabledCases } from '../lib/caseToggles'
import { getRandomCaseAndScramble } from '../lib/randomScramble'
import { createSolve, appendSolve, deleteSolve, deleteAllSolves } from '../lib/solves'

import Scramble from './components/Scramble'
import Solves from './components/Solves'
import SelectedSolve from './components/SelectedSolve'

type Props = {
    cases: Case[]
    toggles: CaseToggles;
    solves: Solve[];
    setSolves: (solves: Solve[]) => void;
}

function TimerPage({ cases, toggles, solves, setSolves }: Props) {
    const enabledCases = getEnabledCases(cases, toggles);

    const initialCaseAndScramble = enabledCases.length > 0 ? getRandomCaseAndScramble(enabledCases) : null;
    const [currentCase, setCurrentCase] = useState<Case | null>(
        () => (initialCaseAndScramble ? initialCaseAndScramble.caseItem : null)
    );
    const [currentScramble, setCurrentScramble] = useState(
        () => (initialCaseAndScramble ? initialCaseAndScramble.scramble : "")
    );

    const [selectedSolveId, setSelectedSolveId] = useState<string | null>(
        () => (solves.length > 0 ? solves[solves.length - 1].id : null)
    );
    const selectedSolve = solves.find(solve => solve.id === selectedSolveId) ?? null;

    const updateCaseAndScramble = (cases: Case[]) => {
        const caseAndScramble = getRandomCaseAndScramble(cases);
        if (!caseAndScramble) {
            setCurrentCase(null);
            setCurrentScramble("");
            return;
        }
        
        setCurrentCase(caseAndScramble.caseItem);
        setCurrentScramble(caseAndScramble.scramble);
    }

    const nextCase = () => {
        if (currentCase === null) return;

        const solve = createSolve(currentCase, currentScramble);
        setSolves(appendSolve(solves, solve));
        setSelectedSolveId(solve.id);

        updateCaseAndScramble(enabledCases);
    }

    const handleDeleteSolve = (id: string) => {
        const next = deleteSolve(solves, id);

        if (selectedSolveId === id) {
            const nextSelected = 
                next.length > 0 
                ? next[next.length - 1].id
                : null;
            setSelectedSolveId(nextSelected);
        }

        setSolves(next);
    };

    const handleDeleteAllSolves = () => {
        setSolves(deleteAllSolves());
    };

    return (
        <> 
            <Scramble 
                currentCase={currentCase} 
                currentScramble={currentScramble} 
                nextCase={nextCase}
            />

            <Solves 
                solves={solves} 
                selectedSolveId={selectedSolveId} 
                onSelectSolve={setSelectedSolveId} 
                onDeleteAllSolves={handleDeleteAllSolves} 
            />

            <SelectedSolve 
                solve={selectedSolve} 
                onDelete={(id) => handleDeleteSolve(id)} 
            />
        </>
    )
}

export default TimerPage
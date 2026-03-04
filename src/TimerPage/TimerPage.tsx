import { useCallback, useMemo, useState } from 'react'

import type { Case, CaseToggles, Solve } from '../types/types'
// import { useCaseStore } from './Stores/useCaseStore'
import { useTimer } from '../hooks/useTimer'

import { getEnabledCases } from '../lib/caseToggles'
import { getRandomCaseAndScramble } from '../lib/randomScramble'
import { createSolve, appendSolve, deleteSolve, deleteAllSolves } from '../lib/solves'
import { formatTime, formatRunningTime } from '../lib/timeFormat'

import Scramble from './components/Scramble'
import Solves from './components/Solves'
import SelectedSolve from './components/SelectedSolve'

type CaseAndScramble = {
    caseItem: Case | null;
    scramble: string;
}

type Props = {
    cases: Case[]
    toggles: CaseToggles;
    solves: Solve[];
    setSolves: React.Dispatch<React.SetStateAction<Solve[]>>;
}

function TimerPage({ cases, toggles, solves, setSolves }: Props) {
    const enabledCases = useMemo(() => getEnabledCases(cases, toggles), [cases, toggles]);

    const initialCaseAndScramble = enabledCases.length > 0 ? getRandomCaseAndScramble(enabledCases) : null;
    const [current, setCurrent] = useState<CaseAndScramble>(() => ({
        caseItem: initialCaseAndScramble?.caseItem ?? null,
        scramble: initialCaseAndScramble?.scramble ?? "",
    }));
    const currentCase = current.caseItem;
    const currentScramble = current.scramble;

    const [selectedSolveId, setSelectedSolveId] = useState<string | null>(
        () => (solves.length > 0 ? solves[solves.length - 1].id : null)
    );
    const selectedSolve = solves.find(solve => solve.id === selectedSolveId) ?? null;

    const updateCaseAndScramble = (cases: Case[]) => {
        const caseAndScramble = getRandomCaseAndScramble(cases);
        if (!caseAndScramble) {
            setCurrent({ caseItem: null, scramble: "" });
            return;
        }
        setCurrent({ caseItem: caseAndScramble.caseItem, scramble: caseAndScramble.scramble });
    }

    const handleStop = useCallback((finalTime: number) => {
        if (currentCase === null) return;

        const solve = createSolve(currentCase, currentScramble, finalTime);
        setSolves(prev => appendSolve(prev, solve));
        setSelectedSolveId(solve.id);
        updateCaseAndScramble(enabledCases);
    }, [currentCase, currentScramble, setSolves, enabledCases]);

    const { time, phase } = useTimer(handleStop);

    const nextCase = () => {
        if (currentCase === null) return;
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

        setSolves(() => next);
    };

    const handleDeleteAllSolves = () => {
        setSolves(() => deleteAllSolves());
    };

    return (
        <> 
            <Scramble 
                currentCase={currentCase} 
                currentScramble={currentScramble} 
                nextCase={nextCase}
            />

            <div>
                {phase}
                {phase === 'running' ? 
                     <>{formatRunningTime(time)}</>
                    :
                    <>{formatTime(time)}</>
                }
            </div>

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
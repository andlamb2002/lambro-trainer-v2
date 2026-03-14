import { useCallback, useMemo, useState } from 'react'

import type { Case, CaseToggles, Solve } from '../types/types'
// import { useCaseStore } from './Stores/useCaseStore'
import { useTimer } from '../hooks/useTimer'
import { useRecap } from '../hooks/useRecap'

import { getEnabledCases } from '../lib/caseToggles'
import { getRandomCaseAndScramble, getRandomScrambleFromCase } from '../lib/randomScramble'
import { createSolve } from '../lib/solves'
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
    addSolve: (solve: Solve) => void;
    deleteSolve: (id: string) => void;
    deleteAllSolves: () => void;
}

function TimerPage({ cases, toggles, solves, addSolve, deleteSolve, deleteAllSolves }: Props) {
    const enabledCases = useMemo(() => getEnabledCases(cases, toggles), [cases, toggles]);
    const isDisabled = enabledCases.length === 0;

    const [current, setCurrent] = useState<CaseAndScramble>(() => {
        if (isDisabled) {
            return { caseItem: null, scramble: "" };
        }

        const caseAndScramble = getRandomCaseAndScramble(enabledCases);

        return {
            caseItem: caseAndScramble?.caseItem ?? null,
            scramble: caseAndScramble?.scramble ?? "",
        };
    });
    const currentCase = current.caseItem;
    const currentScramble = current.scramble;

    const [selectedSolveId, setSelectedSolveId] = useState<string | null>(
        () => (solves.length > 0 ? solves[solves.length - 1].id : null)
    );
    const selectedSolve = solves.find(solve => solve.id === selectedSolveId) ?? null;

    const updateCaseAndScramble = useCallback((cases: Case[]) => {
        const caseAndScramble = getRandomCaseAndScramble(cases);
        if (!caseAndScramble) {
            setCurrent({ caseItem: null, scramble: "" });
            return;
        }
        setCurrent({ caseItem: caseAndScramble.caseItem, scramble: caseAndScramble.scramble });
    }, []);

    const { 
        isActive,
        recapTotal,
        recapProgress,
        startRecap,
        stopRecap,
        handleNextRecap,
        handleDeleteRecap,
    } = useRecap(enabledCases);

    const handleStop = useCallback((finalTime: number) => {
        if (currentCase === null) return;

        const solve = createSolve(currentCase, currentScramble, finalTime);
        addSolve(solve);
        setSelectedSolveId(solve.id);

        if (isActive) {
            const nextRecap = handleNextRecap(solve.id);
            if (nextRecap) {
                updateCaseAndScramble([nextRecap]);
            }
            else {
                updateCaseAndScramble(enabledCases);
            }
        }
        else {
            updateCaseAndScramble(enabledCases);
        }
    }, [currentCase, currentScramble, addSolve, updateCaseAndScramble, enabledCases, handleNextRecap, isActive]);

    const { time, phase } = useTimer(handleStop, isDisabled);

    const handleDeleteSolve = (id: string) => {
        deleteSolve(id);
        handleDeleteRecap(id, currentCase?.id ?? "", cases);
        if (selectedSolveId === id) {
            const nextSelected = solves.filter(s => s.id !== id);
            setSelectedSolveId(nextSelected.length > 0 ? nextSelected[nextSelected.length - 1].id : null);
        } 
    };

    const handleDeleteAllSolves = () => {
        deleteAllSolves();
    };

    const handleStartRecap = () => {
        const firstRecap = startRecap();
        if (!firstRecap) {
            setCurrent({ caseItem: null, scramble: "" });
            return;
        }
        setCurrent({ caseItem: firstRecap, scramble: getRandomScrambleFromCase(firstRecap) });
    };

    return (
        <> 
            <Scramble 
                currentCase={currentCase} 
                currentScramble={currentScramble} 
            />

            <div>
                {isActive 
                    ? <button onClick={stopRecap}>End Recap</button>
                    : <button onClick={handleStartRecap}>Recap</button>
                }
                {isActive && <>{recapProgress} / {recapTotal}</>}
            </div>

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
import { useCallback, useState } from 'react'

import type { Case } from '../types/types'

import { useSessionStore } from '../Stores/useSessionStore'
import { useTimer } from '../hooks/useTimer'
import { useRecap } from '../hooks/useRecap'
import { useActiveSession } from '../hooks/useActiveSession'

import { getRandomCaseAndScramble, getRandomScrambleFromCase } from '../lib/randomScramble'
import { createSolve } from '../lib/solves'

import ScrambleBar from './components/ScrambleBar'
import SolvesList from './components/SolvesList'
import SelectedSolve from './components/SelectedSolve'
import TimerDisplay from './components/TimerDisplay'

type CaseAndScramble = {
    caseItem: Case | null;
    scramble: string;
}

function TimerPage() {
    const addSolve = useSessionStore(s => s.addSolve);
    const deleteSolve = useSessionStore(s => s.deleteSolve);
    const deleteAllSolves = useSessionStore(s => s.deleteAllSolves);
    const updateRecap = useSessionStore(s => s.updateRecap);

    const { 
        cases,
        enabledCases,
        solves,
        recapState,
    } = useActiveSession();

    const isDisabled = enabledCases.length === 0;

    const [current, setCurrent] = useState<CaseAndScramble>(() => {
        if (isDisabled) {
            return { caseItem: null, scramble: "" };
        }

        if (recapState && recapState.queue.length > 0) {
            const currentRecapCase = recapState.queue[recapState.index];
            return { caseItem: currentRecapCase, scramble: getRandomScrambleFromCase(currentRecapCase) };
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
        handleDeleteAllRecap,
    } = useRecap(enabledCases, recapState, updateRecap);

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
    const hudHidden = phase === 'running' || phase === 'holdStart' || phase === 'holdStop';

    const handleDeleteSolve = (id: string) => {
        const solve = solves.find(s => s.id === id);
        if (!solve) return;
        deleteSolve(id);
        handleDeleteRecap(id, solve.caseId, cases);
        if (selectedSolveId === id) {
            const nextSelected = solves.filter(s => s.id !== id);
            setSelectedSolveId(nextSelected.length > 0 ? nextSelected[nextSelected.length - 1].id : null);
        } 
    };

    const handleDeleteAllSolves = () => {
        deleteAllSolves();
        if (currentCase) handleDeleteAllRecap(currentCase);
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
        <div className="flex flex-col grow px-2 py-2 sm:py-4">
            <ScrambleBar
                currentScramble={currentScramble}
                isActive={isActive}
                recapProgress={recapProgress}
                recapTotal={recapTotal}
                handleStartRecap={handleStartRecap}
                stopRecap={stopRecap}
            />

            <div className={`grid ${hudHidden ? 'grid-cols-1' : 'grid-cols-3'} h-full`}>

                <div className={`order-2 sm:order-1 col-span-1 ${hudHidden ? 'hidden' : 'block'}`}>
                    <SolvesList
                        solves={solves}
                        selectedSolveId={selectedSolveId}
                        onSelectSolve={setSelectedSolveId}
                        onDeleteSolve={handleDeleteSolve}
                        onDeleteAllSolves={handleDeleteAllSolves}
                    />
                </div>

                <div className={`order-1 sm:order-2 ${hudHidden ? 'col-span-1' : 'col-span-3 sm:col-span-1'} h-full`}>
                    <TimerDisplay phase={phase} time={time} />
                </div>

                <div className={`order-3 col-span-2 sm:col-span-1 ${hudHidden ? 'hidden' : 'block'}`}>
                    <SelectedSolve
                        solve={selectedSolve}
                        onDelete={(id) => handleDeleteSolve(id)}
                    />
                </div>

            </div>
        </div>
    );
}

export default TimerPage
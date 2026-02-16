import { useState } from 'react'

import type { Case, CaseToggles, Subset, Solve } from '../types/types'
// import { useCaseStore } from './Stores/useCaseStore'

import { 
    setInitialToggles, 
    toggleAll, 
    toggleSet,
    toggleSubset,
    toggle,
    getEnabledCases 
} from '../lib/caseToggles'
import { getRandomCaseAndScramble } from '../lib/randomScramble'
import { createSolve, appendSolve, deleteSolve, deleteAllSolves } from '../lib/solves'

import Scramble from './components/Scramble'
import Solves from './components/Solves'
import SelectedSolve from './components/SelectedSolve'

type Props = {
    cases: Case[]
    subsets: Subset[]
}

function TimerPage({ cases, subsets }: Props) {
    const [toggles, setToggles] = useState<CaseToggles>(() => setInitialToggles(cases));
    const enabledCases = getEnabledCases(cases, toggles);

    const initialCaseAndScramble = enabledCases.length > 0 ? getRandomCaseAndScramble(enabledCases) : null;
    const [currentCase, setCurrentCase] = useState<Case | null>(
        () => (initialCaseAndScramble ? initialCaseAndScramble.caseItem : null)
    );
    const [currentScramble, setCurrentScramble] = useState(
        () => (initialCaseAndScramble ? initialCaseAndScramble.scramble : "")
    );

    const [solves, setSolves] = useState<Solve[]>([]);
    const [selectedSolveId, setSelectedSolveId] = useState<string | null>(null);
    const selectedSolve = solves.find(solve => solve.id === selectedSolveId) ?? null;

    const sets = Array.from(new Set(cases.map(c => c.set)));

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
        setSolves((solves) => appendSolve(solves, solve));
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
        setSelectedSolveId(null);
    };

    const toggleAllCases = (enabled: boolean) => {
        setToggles(prev => {
            const next = toggleAll(prev, enabled);
            const nextEnabledCases = getEnabledCases(cases, next);
            updateCaseAndScramble(nextEnabledCases);
            return next;
        });
    };

    const toggleSetCases = (set: string, enabled: boolean) => {
        setToggles(prev => {
            const next = toggleSet(prev, cases, set, enabled);
            const nextEnabledCases = getEnabledCases(cases, next);
            updateCaseAndScramble(nextEnabledCases);
            return next;
        });
    };

    const toggleSubsetCases = (subset: string, enabled: boolean) => {
        setToggles(prev => {
            const next = toggleSubset(prev, cases, subset, enabled);
            const nextEnabledCases = getEnabledCases(cases, next);
            updateCaseAndScramble(nextEnabledCases);
            return next;
        });
    };

    const toggleCase = (caseId: string) => {
        setToggles(prev => {
            const next = toggle(prev, caseId);
            const nextEnabledCases = getEnabledCases(cases, next);
            updateCaseAndScramble(nextEnabledCases);
            return next;
        });
    };

    return (
        <>
            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => toggleAllCases(true)}>All On</button>
                <button onClick={() => toggleAllCases(false)}>All Off</button>
                <div>Enabled cases: {enabledCases.length}</div>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                {sets.map(setName => (
                    <div key={setName} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <strong>{setName}</strong>
                        <button onClick={() => toggleSetCases(setName, true)}>Set All</button>
                        <button onClick={() => toggleSetCases(setName, false)}>Set None</button>
                    </div>
                ))}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                {subsets.map(s => (
                    <div key={s.id} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <span>{s.id}</span>
                        <button onClick={() => toggleSubsetCases(s.id, true)}>Subset All</button>
                        <button onClick={() => toggleSubsetCases(s.id, false)}>Subset None</button>
                    </div>
                ))}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                {cases.map((c) => (
                    <button key={c.id} onClick={() => toggleCase(c.id)}>
                        {toggles[c.id] ? "ON" : "OFF"} {c.label}
                    </button>
                ))}
            </div>
                
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
import { useMemo } from 'react';

import type { Solve } from '../../types/types';

import { formatTime } from '../../lib/timeFormat';

import SolveItem from './SolveItem';

type Props = {
    solves: Solve[];
    selectedSolveId: string | null;
    onSelectSolve: (id: string) => void;
    onDeleteSolve: (id: string) => void;
    onDeleteAllSolves: () => void;
}

function SolvesList({ solves, selectedSolveId, onSelectSolve, onDeleteSolve, onDeleteAllSolves }: Props) {

    const count = solves.length;
    const mean = useMemo(() => {
        return count > 0 ? formatTime(solves.reduce((acc, solve) => acc + solve.time, 0) / count) : "0.00";
    }, [count, solves]);

    return (
        <>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
                <span>Solves: {count}</span>
                <span>Mean: {mean}</span>
                <button onClick={onDeleteAllSolves} disabled={solves.length === 0}>
                    Delete All
                </button>
            </div>
            <ul>
                {solves.map((solve) => (
                    <li key={solve.id}>
                        <SolveItem
                            solve={solve}
                            selectedSolveId={selectedSolveId}
                            onSelectSolve={onSelectSolve}
                            onDeleteSolve={onDeleteSolve}
                        />
                    </li>
                ))}
            </ul>
        </>
    )
}

export default SolvesList
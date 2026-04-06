import { useMemo, useState } from 'react';

import type { Solve } from '../../types/types';

import { formatTime } from '../../lib/format';
import SolveItem from './SolveItem';
import StatsModal from './StatsModal';

import { MdBarChart } from "react-icons/md";

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

    const [statsOpen, setStatsOpen] = useState(false);

    return (
        <div className="flex flex-col sm:pl-4 pt-2 pr-1 sm:pr-0">

            <div className="flex items-start justify-between">
                <div className="sm:text-xl">
                    <h3>Solves: {count}</h3>
                    <h3>Mean: {mean}</h3>
                </div>
                <button
                    className="btn btn-primary p-1 sm:p-2"
                    onClick={() => setStatsOpen(true)}
                    title="Statistics"
                    aria-label="Statistics"
                >
                    <MdBarChart size={24} />
                </button>
            </div>

            {statsOpen && (
                <StatsModal
                    open={statsOpen}
                    onClose={() => setStatsOpen(false)}
                    solves={solves}
                />
            )}

            <ul className="flex-1 overflow-y-auto max-h-50 sm:max-h-80 my-4 space-y-2 scrollbar-hide">
                {[...solves].reverse().map((solve, index) => (
                    <SolveItem
                        key={solve.id}
                        solve={solve}
                        index={count - index}
                        selectedSolveId={selectedSolveId}
                        onSelectSolve={onSelectSolve}
                        onDeleteSolve={onDeleteSolve}
                    />
                ))}
            </ul>

            <button
                className={`btn btn-danger w-full shadow-lg ${count === 0 ? 'invisible' : ''}`}
                onClick={onDeleteAllSolves}
                title="Delete All Solves"
                aria-label="Delete All Solves"
            >
                Delete All
            </button>

        </div>
    );
}

export default SolvesList

import { formatTime } from '../../lib/timeFormat';
import type { Solve } from '../../types/types';

import { MdDelete } from "react-icons/md";

type Props = {
    solve: Solve;
    index: number;
    selectedSolveId: string | null;
    onSelectSolve: (id: string) => void;
    onDeleteSolve: (id: string) => void;
}

function SolveItem({ solve, index, selectedSolveId, onSelectSolve, onDeleteSolve }: Props) {

    const isSelected = solve.id === selectedSolveId;

    return (
        <li
            className="flex justify-between items-center p-2 rounded shadow-md cursor-pointer bg-secondary hover:bg-secondary/60"
            onClick={() => onSelectSolve(solve.id)}
            title={`Select Solve ${index}`}
            role="button"
            aria-pressed={isSelected}
        >
            <span className={isSelected ? 'font-bold' : ''}>
                {index}. {formatTime(solve.time)}
            </span>
            <button
                className="hidden sm:block btn btn-danger p-1"
                onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSolve(solve.id);
                }}
                title={`Delete Solve ${index}`}
                aria-label={`Delete Solve ${index}`}
            >
                <MdDelete size={24} />
            </button>
        </li>
    );
}

export default SolveItem
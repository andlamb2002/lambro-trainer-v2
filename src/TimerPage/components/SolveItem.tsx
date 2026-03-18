
import { formatTime } from '../../lib/timeFormat';
import type { Solve } from '../../types/types';

type Props = {
    solve: Solve;
    index: number;
    selectedSolveId: string | null;
    onSelectSolve: (id: string) => void;
    onDeleteSolve: (id: string) => void;
}

function SolveItem({ solve, index, selectedSolveId, onSelectSolve, onDeleteSolve }: Props) {
    return (
        <div>
            <button
                type="button"
                onClick={() => onSelectSolve(solve.id)}
                style={{ fontWeight: solve.id === selectedSolveId ? "bold" : "normal" }}
            >
                {index}. {formatTime(solve.time)}
            </button>
            <button
                type="button"
                onClick={() => onDeleteSolve(solve.id)}
                style={{ marginLeft: 8 }}
            >
                Delete
            </button>
        </div>
    )
}

export default SolveItem
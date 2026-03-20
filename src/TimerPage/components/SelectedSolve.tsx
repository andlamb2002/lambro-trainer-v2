import type { Solve } from '../../types/types';
import { formatTime } from '../../lib/timeFormat';

import { MdDelete } from "react-icons/md";

type Props = {
    solve: Solve | null;
    index: number;
    isCooldown: boolean;
    onDelete: (id: string) => void;
}

function SelectedSolve({ solve, index, isCooldown, onDelete }: Props) {
    if (!solve) {
        return (
            <div className="bg-secondary text-xl font-bold rounded shadow-md p-4 ml-1 sm:ml-0 sm:mr-4">
                No solves
            </div>
        );
    }

    const hasSubset = solve.subset != null;

    return (
        <div className="bg-secondary rounded shadow-md px-4 py-2 ml-1 sm:ml-0 sm:mr-4">

            <div className="flex justify-between items-center">
                <div className="text-xl font-bold">
                    {index}. {formatTime(solve.time)}
                </div>
                <button
                    className="btn btn-danger p-1"
                    onClick={() => onDelete(solve.id)}
                    title={`Delete Solve ${index}`}
                    aria-label={`Delete Solve ${index}`}
                    disabled={isCooldown}
                >
                    <MdDelete size={24} />
                </button>
            </div>

            <div>Case: {solve.label}</div>

            {solve.img && (
                <img
                    src={solve.img}
                    alt={`Case ${solve.label}`}
                    className="w-24 h-24 sm:w-36 sm:h-36 object-contain"
                />
            )}

            <div>{solve.scramble}</div>

            {!hasSubset && (
                <div className="mt-2">Solution: {solve.originalAlg}</div>
            )}

        </div>
    );
}

export default SelectedSolve
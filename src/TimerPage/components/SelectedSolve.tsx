import type { Solve } from '../../types/types';

import { formatTime } from '../../lib/timeFormat';

type Props = {
    solve: Solve | null;
    onDelete: (id: string) => void;
}

function SelectedSolve({ solve, onDelete }: Props) {
    if (!solve) return <div style={{ marginTop: 12 }}>No solve selected.</div>;

    return (
        <div style={{ marginTop: 12 }}>
            <h3>Selected Solve</h3>

            <div>Label: {solve.label}</div>
            <div>Time: {formatTime(solve.time)}</div>
            {solve.subset && <div>Subset: {solve.subset}</div>}
            {solve.variant && <div>Variant: {solve.variant}</div>}
            {!solve.subset && <div>Original Alg: {solve.originalAlg}</div>}
            <div>Scramble: {solve.scramble}</div>

            <button onClick={() => onDelete(solve.id)} style={{ marginTop: 8 }}>
                Delete This Solve
            </button>
        </div>
    );
}

export default SelectedSolve
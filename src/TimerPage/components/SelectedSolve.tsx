import type { Solve } from '../../types/types';

type Props = {
    solve: Solve | null;
    onDelete: () => void;
}

function SelectedSolve({ solve, onDelete }: Props) {
    if (!solve) return <div style={{ marginTop: 12 }}>No solve selected.</div>;

    return (
        <div style={{ marginTop: 12 }}>
            <h3>Selected Solve</h3>

            <div>Label: {solve.label}</div>
            <div>Time: {solve.time.toFixed(2)}</div>
            <div>Subset: {solve.subset ?? "-"}</div>
            <div>Variant: {solve.variant ?? "-"}</div>
            <div>Scramble: {solve.scramble}</div>

            <button onClick={onDelete} style={{ marginTop: 8 }}>
                Delete This Solve
            </button>
        </div>
    );
}

export default SelectedSolve
import type { Solve } from '../../types/types';

type Props = {
    solves: Solve[];
    selectedSolveId: string | null;
    onSelectSolve: (id: string) => void;
    onDeleteAllSolves: () => void;
}

function Solves({ solves, selectedSolveId, onSelectSolve, onDeleteAllSolves }: Props) {
    return (
        <>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
                <strong>Solves</strong>
                <button onClick={onDeleteAllSolves} disabled={solves.length === 0}>
                    Delete All
                </button>
            </div>
            <ul>
                {solves.map((solve) => (
                    <li key={solve.id}>
                        <button
                            type="button"
                            onClick={() => onSelectSolve(solve.id)}
                            style={{ fontWeight: solve.id === selectedSolveId ? "bold" : "normal" }}
                        >
                            {solve.time}
                        </button>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default Solves
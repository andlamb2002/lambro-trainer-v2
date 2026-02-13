import type { Solve } from '../../types/types';

type Props = {
    solves: Solve[];
    selectedSolveId: string | null;
    onSelectSolve: (id: string) => void;
}

function Solves({ solves, selectedSolveId, onSelectSolve }: Props) {
    return (
        <>
            {/* <ul>
                {solves.map(solve => (
                    <li key={solve.id}> {solve.label} </li>
                ))}
            </ul> */}
            <ul>
                {solves.map((solve) => (
                    <li key={solve.id}>
                        <button
                            type="button"
                            onClick={() => onSelectSolve(solve.id)}
                            style={{ fontWeight: solve.id === selectedSolveId ? "bold" : "normal" }}
                        >
                            {solve.label}
                        </button>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default Solves
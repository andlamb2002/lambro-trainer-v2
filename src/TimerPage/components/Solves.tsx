import type { Solve } from '../../types/types';

type Props = {
    solves: Solve[];
}

function Solves({ solves }: Props) {
    return (
        <>
            <ul>
                {solves.map(solve => (
                    <li key={solve.id}> {solve.label} </li>
                ))}
            </ul>
        </>
    )
}

export default Solves
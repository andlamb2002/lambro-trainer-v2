import type { Case } from '../../types/types';

type Props = {
    c: Case;
    toggleCase: (caseId: string) => void;
    toggles: Record<string, boolean>;
}

function CaseItem({ c, toggleCase, toggles }: Props) {
    return (
        <>
            <button 
                key={c.id} 
                onClick={() => toggleCase(c.id)}
            >
                {toggles[c.id] ? "ON" : "OFF"} {c.label}
            </button>
        </>
    )
}

export default CaseItem
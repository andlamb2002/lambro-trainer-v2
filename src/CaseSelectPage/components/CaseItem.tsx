import type { Case } from '../../types/types';

type Props = {
    c: Case;
    toggleCase: (caseId: string) => void;
    enabled: boolean;
}

function CaseItem({ c, toggleCase, enabled }: Props) {
    return (
        <>
            <button 
                key={c.id} 
                onClick={() => toggleCase(c.id)}
            >
                {enabled ? "ON" : "OFF"} {c.label}
            </button>
        </>
    )
}

export default CaseItem
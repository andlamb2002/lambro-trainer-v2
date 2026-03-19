import type { Case } from '../../types/types';

type Props = {
    c: Case;
    toggleCase: (caseId: string) => void;
    enabled: boolean;
}

function CaseItem({ c, toggleCase, enabled }: Props) {
    return (
        <div
            onClick={() => toggleCase(c.id)}
            className={`aspect-square flex items-center justify-center rounded cursor-pointer hover:opacity-60 ${enabled ? 'bg-success' : ''}`}
            title={`${c.label} (${c.id})`}
            role="button"
            aria-pressed={enabled}
        >
            <img
                src={c.img}
                alt={`Case ${c.label}`}
                className="object-contain"
            />
        </div>
    );
}

export default CaseItem
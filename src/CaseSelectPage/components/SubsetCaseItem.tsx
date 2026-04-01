import type { Subset, Case } from '../../types/types';

type Props = {
    subset: Subset;
    cases: Case[];
    toggles: Record<string, boolean>;
    enableAll: () => void;
    disableAll: () => void;
}

function SubsetCaseItem({ subset, cases, toggles, enableAll, disableAll }: Props) {

    const enabledCount = cases.filter(c => toggles[c.id]).length;
    const total = cases.length;
    const state = enabledCount === 0 ? 'none' : enabledCount === total ? 'all' : 'some';

    const bgClass =
        state === 'all'  ? 'bg-success' :
        state === 'some' ? 'bg-warning' :
        '';

    const handleToggleAll = () => {
        if (state === 'all') {
            disableAll();
        } else {
            enableAll();
        }
    }

    return (
        <div
            onClick={() => handleToggleAll()}
            className={`aspect-square flex items-center justify-center rounded cursor-pointer hover:opacity-60 ${bgClass}`}
            title={`${subset.set} (${subset.id})`}
            role="button"
            aria-pressed={state === 'all'}
        >
            <img
                src={subset.img}
                alt={`Case ${subset.set}`}
                className="object-contain"
            />
        </div>
    );
}

export default SubsetCaseItem
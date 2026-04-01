import { createPortal } from 'react-dom';

import type { Subset, Case } from "../../types/types";
import CaseItem from './CaseItem';


type Props = {
    subset: Subset;
    cases: Case[];
    toggles: Record<string, boolean>;
    toggleCase: (caseId: string) => void;
    enableAll: () => void;
    disableAll: () => void;
    onClose: () => void;
}

function SubsetModal({ subset, cases, toggles, toggleCase, enableAll, disableAll, onClose }: Props) {

    return createPortal(
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
            onClick={onClose} 
        >
            <div 
                className="bg-primary rounded w-full max-w-3xl p-4 shadow-md"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex gap-2 items-end pb-4">
                    <h3 className="text-lg">{subset.id}</h3>
                    <button 
                        className="btn btn-success" 
                        onClick={enableAll}
                        title={`Toggle All - ${subset.id}`} 
                        aria-label={`Toggle All - ${subset.id}`}
                    >
                        All
                    </button>
                    <button 
                        className="btn btn-danger" 
                        onClick={disableAll}
                        title={`Toggle None - ${subset.id}`} 
                        aria-label={`Toggle None - ${subset.id}`}
                    >
                        None
                    </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {cases.map((c) => (
                        <CaseItem
                            key={c.id}
                            c={c}
                            toggleCase={toggleCase}
                            enabled={toggles[c.id]}
                        />
                    ))}
                </div>
            </div>
        </div>,
        document.body
    );
}

export default SubsetModal
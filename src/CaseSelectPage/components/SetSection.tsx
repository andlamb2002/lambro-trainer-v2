import type { Case, Subset } from "../../types/types";

import SubsetCaseItem from "./SubsetCaseItem";
import CaseItem from "./CaseItem";

type Props = {
    setName: string;
    casesBySet: Map<string, Case[]>;
    subsetsBySet: Map<string, Subset[]>;
    casesBySubset: Map<string, Case[]>;
    toggles: Record<string, boolean>;
    toggleCase: (caseId: string) => void;
    toggleSetCases: (set: string, enabled: boolean) => void;
    toggleSubsetCases: (subset: string, enabled: boolean) => void;
}

function SetSection({ setName, casesBySet, subsetsBySet, casesBySubset, toggles, toggleCase, toggleSetCases, toggleSubsetCases }: Props) {
    const setCases = casesBySet.get(setName) ?? [];
    const setSubsets = subsetsBySet.get(setName) ?? [];
    const hasSubsets = setSubsets.length > 0;

    return (
        <div>
            <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-semibold">{setName}</h3>
                <button
                    className="btn btn-success"
                    onClick={() => toggleSetCases(setName, true)}
                    title={`Enable All - ${setName}`}
                    aria-label={`Enable All - ${setName}`}
                >
                    All
                </button>
                <button
                    className="btn btn-danger"
                    onClick={() => toggleSetCases(setName, false)}
                    title={`Disable All - ${setName}`}
                    aria-label={`Disable All - ${setName}`}
                >
                    None
                </button>
            </div>

            {hasSubsets ? (
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1">
                    {setSubsets.map((subset) => {
                        const subsetCases = casesBySubset.get(subset.id) ?? [];
                        return (
                            <div key={subset.id}>
                                <SubsetCaseItem 
                                    subset={subset}
                                    cases={subsetCases}
                                    toggles={toggles}
                                    enableAll={() => toggleSubsetCases(subset.id, true)}
                                    disableAll={() => toggleSubsetCases(subset.id, false)}
                                />
                            </div>
                            // <div key={subset.id}>
                            //     <div className="flex items-center gap-2 mb-2 pl-2">
                            //         <span className="font-medium">{subset.id}</span>
                            //         <button
                            //             className="btn btn-success"
                            //             onClick={() => toggleSubsetCases(subset.id, true)}
                            //             title={`Enable All - ${subset.id}`}
                            //             aria-label={`Enable All - ${subset.id}`}
                            //         >
                            //             All
                            //         </button>
                            //         <button
                            //             className="btn btn-danger"
                            //             onClick={() => toggleSubsetCases(subset.id, false)}
                            //             title={`Disable All - ${subset.id}`}
                            //             aria-label={`Disable All - ${subset.id}`}
                            //         >
                            //             None
                            //         </button>
                            //     </div>
                            //     <div className="grid grid-cols-4 sm:grid-cols-8 gap-1">
                            //         {subsetCases.map((c) => (
                            //             <CaseItem
                            //                 key={c.id}
                            //                 c={c}
                            //                 toggleCase={toggleCase}
                            //                 enabled={toggles[c.id]}
                            //             />
                            //         ))}
                            //     </div>
                            // </div>
                        );
                    })}
                </div>
            ) : (
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1">
                    {setCases.map((c) => (
                        <CaseItem
                            key={c.id}
                            c={c}
                            toggleCase={toggleCase}
                            enabled={toggles[c.id]}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default SetSection
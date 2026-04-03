import { useState } from "react";
import type { Case, Subset } from "../../types/types";

import SubsetCaseItem from "./SubsetCaseItem";
import CaseItem from "./CaseItem";
import SubsetModal from "./SubsetModal"

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

    const [activeSubsetId, setActiveSubsetId] = useState<string | null>(null);
    const activeSubset = setSubsets.find(s => s.id === activeSubsetId) ?? null;
    const activeSubsetCases = activeSubset ? (casesBySubset.get(activeSubset.id) ?? []) : [];

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
                            <SubsetCaseItem 
                                key={subset.id}
                                subset={subset}
                                cases={subsetCases}
                                toggles={toggles}
                                enableAll={() => toggleSubsetCases(subset.id, true)}
                                disableAll={() => toggleSubsetCases(subset.id, false)}
                                onOpen={() => setActiveSubsetId(subset.id)}
                            />
                        );
                    })}
                    {activeSubset && (
                        <SubsetModal
                            subset={activeSubset}
                            cases={activeSubsetCases}
                            toggles={toggles}
                            toggleCase={toggleCase}
                            enableAll={() => toggleSubsetCases(activeSubset.id, true)}
                            disableAll={() => toggleSubsetCases(activeSubset.id, false)}
                            onClose={() => setActiveSubsetId(null)}
                        />
                    )}
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
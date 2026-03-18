import type { Case, Subset } from "../../types/types";

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
        <div key={setName}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <strong style={{ fontSize: 16 }}>{setName}</strong>
                <button onClick={() => toggleSetCases(setName, true)}>All</button>
                <button onClick={() => toggleSetCases(setName, false)}>None</button>
            </div>

            {hasSubsets ? (
                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
                    {setSubsets.map((subset) => {
                        const subsetCases = casesBySubset.get(subset.id) ?? [];

                        return (
                            <div key={subset.id} style={{ paddingLeft: 12 }}>
                                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                                    <span style={{ fontWeight: 600 }}>{subset.id}</span>
                                    <button onClick={() => toggleSubsetCases(subset.id, true)}>All</button>
                                    <button onClick={() => toggleSubsetCases(subset.id, false)}>None</button>
                                </div>

                                <div style={{ marginTop: 6, display: "flex", gap: 8, flexWrap: "wrap" }}>
                                    {subsetCases.map((c) => (
                                        <CaseItem
                                            key={c.id}
                                            c={c}
                                            toggleCase={toggleCase}
                                            enabled={toggles[c.id]}
                                        />
                                        // <button key={c.id} onClick={() => toggleCase(c.id)}>
                                        //     {toggles[c.id] ? "ON" : "OFF"} {c.label}
                                        // </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
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
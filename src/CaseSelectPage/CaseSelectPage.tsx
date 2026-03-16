import { useMemo } from 'react';
import { useSessionStore } from '../Stores/useSessionStore';
import { useActiveSession } from '../hooks/useActiveSession';

import type { Case, Subset } from '../types/types';

import { 
    toggleAll, 
    toggleSet,
    toggleSubset,
    toggle,
} from '../lib/caseToggles'
import { getAllAlgSets } from '../data/algSets';

function CaseSelectPage() {

    const allSets = getAllAlgSets();

    const handleChangeSet = useSessionStore(s => s.handleChangeSet);
    const setToggles = useSessionStore(s => s.setToggles);

    const { 
        activeSetKey,
        cases,
        subsets,
        toggles,
    } = useActiveSession();

    const sets = useMemo(() => {
        const s = new Set<string>();
        cases.forEach(c => s.add(c.set));
        return Array.from(s);
    }, [cases]);

    const casesBySet = useMemo(() => {
        const map = new Map<string, Case[]>();
        cases.forEach(c => {
            const arr = map.get(c.set) ?? [];
            arr.push(c);
            map.set(c.set, arr);
        });
        return map;
    }, [cases]);

    const subsetsBySet = useMemo(() => {
        if (!subsets) return new Map<string, Subset[]>();
        const map = new Map<string, Subset[]>();
        subsets.forEach(s => {
            const arr = map.get(s.set) ?? [];
            arr.push(s);
            map.set(s.set, arr);
        });
        return map;
    }, [subsets]);

    const casesBySubset = useMemo(() => {
        const map = new Map<string, Case[]>();
        cases.forEach(c => {
            if (c.subset) {
                const arr = map.get(c.subset) ?? [];
                arr.push(c);
                map.set(c.subset, arr);
            }
        });
        return map;
    }, [cases]);

    const toggleAllCases = (enabled: boolean) => {
        setToggles(toggleAll(toggles, enabled));
    };

    const toggleSetCases = (set: string, enabled: boolean) => {
        setToggles(toggleSet(toggles, cases, set, enabled));
    };

    const toggleSubsetCases = (subset: string, enabled: boolean) => {
        setToggles(toggleSubset(toggles, cases, subset, enabled));
    };

    const toggleCase = (caseId: string) => {
        setToggles(toggle(toggles, caseId));
    };

    return (
        <>
            <div style={{ display: "flex", gap: 8 }}>
                <select value={activeSetKey} onChange={(e) => handleChangeSet(e.target.value)}>
                    {allSets.map(s => (
                        <option key={s.id} value={s.id}>
                            {s.label}
                        </option>
                    ))}
                </select>
                <button onClick={() => toggleAllCases(true)}>All</button>
                <button onClick={() => toggleAllCases(false)}>None</button>
            </div>

            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
                {sets.map((setName) => {
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
                                                        <button key={c.id} onClick={() => toggleCase(c.id)}>
                                                            {toggles[c.id] ? "ON" : "OFF"} {c.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                                    {setCases.map((c) => (
                                        <button key={c.id} onClick={() => toggleCase(c.id)}>
                                            {toggles[c.id] ? "ON" : "OFF"} {c.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    )
}

export default CaseSelectPage
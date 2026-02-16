import type { Case, Subset, CaseToggles } from '../types/types';

import { 
    toggleAll, 
    toggleSet,
    toggleSubset,
    toggle,
} from '../lib/caseToggles'

type Props = {
    cases: Case[]
    subsets: Subset[]
    toggles: CaseToggles;
    setToggles: React.Dispatch<React.SetStateAction<CaseToggles>>;
}

function CaseSelectPage( { cases, subsets, toggles, setToggles }: Props) {

    const sets = Array.from(new Set(cases.map(c => c.set)));

    const toggleAllCases = (enabled: boolean) => {
        setToggles(prev => toggleAll(prev, enabled));
    };

    const toggleSetCases = (set: string, enabled: boolean) => {
        setToggles(prev => toggleSet(prev, cases, set, enabled));
    };

    const toggleSubsetCases = (subset: string, enabled: boolean) => {
        setToggles(prev => toggleSubset(prev, cases, subset, enabled));
    };

    const toggleCase = (caseId: string) => {
        setToggles(prev => toggle(prev, caseId));
    };

    return (
        <>
            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => toggleAllCases(true)}>All On</button>
                <button onClick={() => toggleAllCases(false)}>All Off</button>
                {/* <div>Enabled cases: {enabledCases.length}</div> */}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                {sets.map(setName => (
                    <div key={setName} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <strong>{setName}</strong>
                        <button onClick={() => toggleSetCases(setName, true)}>Set All</button>
                        <button onClick={() => toggleSetCases(setName, false)}>Set None</button>
                    </div>
                ))}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                {subsets.map(s => (
                    <div key={s.id} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <span>{s.id}</span>
                        <button onClick={() => toggleSubsetCases(s.id, true)}>Subset All</button>
                        <button onClick={() => toggleSubsetCases(s.id, false)}>Subset None</button>
                    </div>
                ))}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                {cases.map((c) => (
                    <button key={c.id} onClick={() => toggleCase(c.id)}>
                        {toggles[c.id] ? "ON" : "OFF"} {c.label}
                    </button>
                ))}
            </div>
        </>
    )
}

export default CaseSelectPage
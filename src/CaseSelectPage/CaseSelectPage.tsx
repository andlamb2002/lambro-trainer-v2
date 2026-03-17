import { useSessionStore } from '../Stores/useSessionStore';
import { useActiveSession } from '../hooks/useActiveSession';

import AlgSetSelect from './components/AlgSetSelect';
import SetSection from './components/SetSection';

import { 
    toggleAll, 
    toggleSet,
    toggleSubset,
    toggle,
} from '../lib/caseToggles'
import { getAllAlgSets } from '../data/algSets';
import { useCaseGroups } from '../hooks/useCaseGroups';

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

    const {
        sets,
        casesBySet,
        subsetsBySet,
        casesBySubset,
    } = useCaseGroups(cases, subsets);

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
            <AlgSetSelect
                allSets={allSets}
                activeSetKey={activeSetKey}
                handleChangeSet={handleChangeSet}
                toggleAllCases={toggleAllCases}
            />

            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
                {sets.map((setName) => {
                    return (
                        <SetSection
                            setName={setName}
                            casesBySet={casesBySet}
                            subsetsBySet={subsetsBySet}
                            casesBySubset={casesBySubset}
                            toggles={toggles}
                            toggleCase={toggleCase}
                            toggleSetCases={toggleSetCases}
                            toggleSubsetCases={toggleSubsetCases}
                        />
                    );
                })}
            </div>
        </>
    )
}

export default CaseSelectPage
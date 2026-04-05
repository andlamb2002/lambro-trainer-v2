import { useSessionStore } from '../Stores/useSessionStore';
import { useActiveSession } from '../hooks/useActiveSession';

import AlgSetSelect from './components/AlgSetSelect';
import SetSection from './components/SetSection';
import SessionSection from './components/SessionsSection';

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

    const sessions = useSessionStore(s => s.sessions);
    const activeSessionId = useSessionStore(s => s.activeSessionId);
    const setActiveSessionId = useSessionStore(s => s.setActiveSessionId);
    const handleChangeSet = useSessionStore(s => s.handleChangeSet);
    const setToggles = useSessionStore(s => s.setToggles);
    const getSessionCount = useSessionStore(s => s.getSessionCount);
    const handleSaveSession = useSessionStore(s => s.handleSaveSession);
    const handleDeleteSession = useSessionStore(s => s.handleDeleteSession);

    const sessionsWithCount = sessions.map(s => ({
        ...s,
        count: getSessionCount(s.id),
    }));

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
        <div className="grid grid-cols-1 md:grid-cols-3 px-2 py-2 sm:py-4">
            <div className="col-span-2 flex flex-col gap-4 sm:px-4">
                    <AlgSetSelect
                        allSets={allSets}
                        activeSetKey={activeSetKey}
                        handleChangeSet={handleChangeSet}
                        toggleAllCases={toggleAllCases}
                    />
                <div className="flex flex-col gap-8 mt-2">
                    {sets.map((setName) => (
                        <SetSection
                            key={setName}
                            setName={setName}
                            casesBySet={casesBySet}
                            subsetsBySet={subsetsBySet}
                            casesBySubset={casesBySubset}
                            toggles={toggles}
                            toggleCase={toggleCase}
                            toggleSetCases={toggleSetCases}
                            toggleSubsetCases={toggleSubsetCases}
                        />
                    ))}
                </div>
            </div>
            <div className="col-span-1">
                <SessionSection
                    sessions={sessionsWithCount}
                    activeSessionId={activeSessionId}
                    onSelect={setActiveSessionId}
                    onSave={handleSaveSession}
                    onDelete={handleDeleteSession}
                />
            </div>
        </div>
    )
}

export default CaseSelectPage
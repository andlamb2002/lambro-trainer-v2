type Props = {
    allSets: { id: string; label: string }[];
    activeSetKey: string;
    handleChangeSet: (key: string) => void;
    toggleAllCases: (selectAll: boolean) => void;
}

function AlgSetSelect({ allSets, activeSetKey, handleChangeSet, toggleAllCases }: Props) {
    return (
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
    )
}

export default AlgSetSelect
import { Link } from "react-router-dom";

import { MdArrowBack } from "react-icons/md";

type Props = {
    allSets: { id: string; label: string }[];
    activeSetKey: string;
    handleChangeSet: (key: string) => void;
    toggleAllCases: (selectAll: boolean) => void;
}

function AlgSetSelect({ allSets, activeSetKey, handleChangeSet, toggleAllCases }: Props) {
    return (
        <div className="flex items-center gap-2">
            <select
                value={activeSetKey}
                onChange={(e) => handleChangeSet(e.target.value)}
                className="bg-primary text-text rounded shadow-md px-2 py-1 cursor-pointer"
            >
                {allSets.map(s => (
                    <option key={s.id} value={s.id}>
                        {s.label}
                    </option>
                ))}
            </select>
            <button
                onClick={() => toggleAllCases(true)}
                className="btn btn-success"
                title="Enable All"
                aria-label="Enable All"
            >
                All
            </button>
            <button
                onClick={() => toggleAllCases(false)}
                className="btn btn-danger"
                title="Disable All"
                aria-label="Disable All"
            >
                None
            </button>
            <Link
                to="/"
                className="btn btn-primary flex items-center gap-1 font-bold"
                title="Timer"
                aria-label="Timer"
            >
                <MdArrowBack size={20} />
                Timer
            </Link>
        </div>
    );
}

export default AlgSetSelect
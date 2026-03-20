import { Link } from "react-router-dom";

import { MdArrowForward } from "react-icons/md";

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
                className="btn btn-primary flex items-center gap-1 text-2xl font-bold w-auto self-start sm:self-auto px-2 py-1 sm:px-4 sm:py-2"
                title="Timer"
                aria-label="Timer"
            >
                Train
                <MdArrowForward size={24} />
            </Link>
        </div>
    );
}

export default AlgSetSelect
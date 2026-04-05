import { MdAdd } from "react-icons/md";
import SessionItem from "./SessionItem";

type SessionItem = {
    id: string;
    label: string;
    setLabel: string;
    count: number;
};

type Props = {
    sessions: SessionItem[];
    activeSessionId: string;
    onSelect: (id: string) => void;
    onNew: (label: string) => void;
    onDelete: (id: string) => void;
};

function SessionSection({ sessions, activeSessionId, onSelect, onNew, onDelete }: Props) {

    const handleSelect = (id: string) => {
        onSelect(id);
    };

    const handleAdd = () => {
        const name = window.prompt("Session name:")?.trim();
        if (!name) return;
        if (sessions.some(s => s.label === name)) {
            window.alert(`A session named "${name}" already exists.`);
            return;
        }
        onNew(name);
    };

    const handleDelete = (id: string) => {
        const session = sessions.find(s => s.id === id);
        if (!session) return;
        if (window.confirm(`Delete session "${session.label}"?`)) {
            onDelete(id);
        }
    };

    return (
        <div className="sm:px-4 pt-4 md:pt-0">
            <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold underline">Sessions</h2>
                <button
                    className="btn btn-success p-1"
                    onClick={handleAdd}
                    title="New Session"
                    aria-label="New Session"
                >
                    <MdAdd size={20} />
                </button>

            </div>

            <ul className="flex flex-col gap-2 py-2">
                {sessions.map((session) => (
                    <SessionItem
                        key={session.id}
                        id={session.id}
                        label={session.label}
                        count={session.count}
                        setLabel={session.setLabel}
                        isActive={session.id === activeSessionId}
                        isOnly={sessions.length <= 1}
                        onSelect={handleSelect}
                        onDelete={handleDelete}
                    />
                ))}
            </ul>
        </div>
    );
}

export default SessionSection
import { useState } from "react";
import SessionItem from "./SessionItem";

type SessionItem = {
    id: string;
    label: string;
    setId: string;
};

type Props = {
    sessions: SessionItem[];
    activeSessionId: string;
    onSelect: (id: string) => void;
    onSave: (label: string) => void;
    onDelete: (id: string) => void;
};

function SessionSection({ sessions, activeSessionId, onSelect, onSave, onDelete }: Props) {
    const [inputName, setInputName] = useState<string>(
        () => sessions.find(s => s.id === activeSessionId)?.label ?? ""
    );

    const handleSelect = (id: string, label: string) => {
        onSelect(id);
        setInputName(label);
    };

    const handleSave = () => {
        const trimmed = inputName.trim();
        if (!trimmed) return;
        onSave(trimmed);
    };

    const handleDelete = (id: string) => {
        const session = sessions.find(s => s.id === id);
        if (!session) return;
        if (window.confirm(`Delete session "${session.label}"?`)) {
            onDelete(id);
        }
    };

    return (
        <div className="sm:px-4 pt-2 sm:pt-0">
            <h2 className="text-xl font-bold underline">Sessions</h2>

            <div className="flex gap-2 pt-2">
                <input
                    className="min-w-0 grow bg-secondary placeholder:text-text/60 rounded shadow-md px-2 py-1 focus:outline-none"
                    type="text"
                    placeholder="Enter session name"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                />
                <button
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={inputName.trim() === ""}
                    title="New Session"
                    aria-label="New Session"
                >
                    Save
                </button>
            </div>

            <ul className="flex flex-col gap-2 py-2">
                {sessions.map((session) => (
                    <SessionItem
                        key={session.id}
                        id={session.id}
                        label={session.label}
                        setId={session.setId}
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
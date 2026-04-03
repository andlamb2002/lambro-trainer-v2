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
    onNew: (label: string) => void;
    onDelete: (id: string) => void;
    onRename: (id: string, label: string) => void;
};

function SessionSection({ sessions, activeSessionId, onSelect, onNew, onDelete, onRename }: Props) {
    // All state and handlers will be wired in the next step
    const activeSession = sessions.find(s => s.id === activeSessionId) ?? null;

    return (
        <div className="sm:px-4 pt-2 sm:pt-0">
            <h2 className="text-xl font-bold underline">Sessions</h2>

            {/* New session form - mirrors PresetSection's name input + Save */}
            <div className="flex gap-2 pt-2">
                <input
                    className="min-w-0 grow bg-secondary placeholder:text-text/60 rounded shadow-md px-2 py-1 focus:outline-none"
                    type="text"
                    placeholder="Enter session name"
                    // value and onChange come next step
                />
                <button
                    className="btn btn-primary"
                    title="New Session"
                    aria-label="New Session"
                >
                    Save
                </button>
            </div>

            {/* Session list - mirrors PresetSection's item list */}
            <ul className="flex flex-col gap-2 py-2">
                {sessions.map((session) => (
                    <SessionItem
                        key={session.id}
                        id={session.id}
                        label={session.label}
                        setId={session.setId}
                        isActive={session.id === activeSessionId}
                        isOnly={sessions.length <= 1}
                        onSelect={onSelect}
                        onDelete={onDelete}
                    />
                ))}
            </ul>
        </div>
    );
}

export default SessionSection
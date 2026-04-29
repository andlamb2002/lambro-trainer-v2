import { closestCenter, DndContext, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { MdAdd } from "react-icons/md";
import SessionItem from "./SessionItem";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";

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
    onRename: (id: string) => void;
    onDelete: (id: string) => void;
    reorderSessions: (oldIndex: number, newIndex: number) => void;
};

function SessionSection({ sessions, activeSessionId, onSelect, onNew, onRename, onDelete, reorderSessions }: Props) {

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

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = sessions.findIndex(s => s.id === String(active.id));
        const newIndex = sessions.findIndex(s => s.id === String(over.id));
        if (oldIndex === -1 || newIndex === -1) return;

        reorderSessions(oldIndex, newIndex);
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    return (
        <div className="sm:px-4 pt-4 md:pt-0">
            <h2 className="text-xl font-bold underline">Sessions</h2>

            <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                sensors={sensors}
            >
                <SortableContext
                    items={sessions.map(s => s.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <ul className="flex flex-col gap-2 py-2 overflow-y-auto max-h-60 md:max-h-100 scrollbar-hide">
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
                                onRename={onRename}
                                onDelete={handleDelete}
                            />
                        ))}
                    </ul>
                </SortableContext>
            </DndContext>
            
            <button
                className="btn btn-success w-full font-bold shadow-lg flex items-center justify-center gap-1 py-2"
                onClick={handleAdd}
                title="New Session"
                aria-label="New Session"
            >
                <MdAdd size={20} />
                New Session
            </button>
        </div>
    );
}

export default SessionSection
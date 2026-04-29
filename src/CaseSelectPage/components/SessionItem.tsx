import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDelete, MdDragIndicator, MdDriveFileRenameOutline } from "react-icons/md";

type Props = {
    id: string;
    label: string;
    count: number;
    setLabel: string;
    isActive: boolean;
    isOnly: boolean;
    onSelect: (id: string, label: string) => void;
    onRename: (id: string) => void;
    onDelete: (id: string) => void;
};

function SessionItem({ id, label, count, setLabel, isActive, isOnly, onSelect, onRename, onDelete }: Props) {

    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({ id });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    return (
        <li
            className={`flex justify-between items-center bg-secondary p-2 rounded shadow-md cursor-pointer hover:bg-secondary/60 ${isActive ? 'font-bold' : ''}`}
            onClick={() => onSelect(id, label)}
            title={`Switch to ${label}`}
            role="button"
            aria-pressed={isActive}
            ref={setNodeRef}
            style={style}
        >
            <div>
                <button
                    className="cursor-grab active:cursor-grabbing p-1 hover:text-accent"
                    title="Drag to reorder"
                    {...attributes}
                    {...listeners}
                >
                <MdDragIndicator size={20} />
            </button>
                {label} ({setLabel}, {count})
            </div>
            <div className="flex gap-2">
                <button
                    className="btn btn-primary p-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRename(id);
                    }}
                    title={`Rename ${label}`}
                    aria-label={`Rename ${label}`}
                >
                    <MdDriveFileRenameOutline size={24} />
                </button>
                <button
                    className="btn btn-danger p-1"
                    disabled={isOnly}
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(id);
                    }}
                    title={`Delete ${label}`}
                    aria-label={`Delete ${label}`}
                >
                    <MdDelete size={24} />
                </button>
            </div>
            
        </li>
    );
}

export default SessionItem
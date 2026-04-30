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
            ref={setNodeRef}
            style={style}
            className={`flex justify-between items-center bg-secondary py-2 pr-2 rounded shadow-md ${isActive ? 'font-bold' : ''}`}
        >
            <button
                className="cursor-grab active:cursor-grabbing p-1 hover:text-accent touch-none shrink-0"
                title="Drag to reorder"
                {...attributes}
                {...listeners}
            >
                <MdDragIndicator size={20} />
            </button>

            <div
                onClick={() => onSelect(id, label)}
                className="flex-1 pl-2 cursor-pointer hover:opacity-60"
                title={`Switch to ${label}`}
            >
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
                    <MdDriveFileRenameOutline size={20} />
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
                    <MdDelete size={20} />
                </button>
            </div>
        </li>
    );
}

export default SessionItem
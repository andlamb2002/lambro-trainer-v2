import { MdDelete } from "react-icons/md";

type Props = {
    id: string;
    label: string;
    setId: string;
    isActive: boolean;
    isOnly: boolean;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
};

function SessionItem({ id, label, setId, isActive, isOnly, onSelect, onDelete }: Props) {
    return (
        <li
            className={`flex justify-between items-center bg-secondary p-2 rounded shadow-md cursor-pointer hover:bg-secondary/60 ${isActive ? 'font-bold' : ''}`}
            onClick={() => onSelect(id)}
            title={`Switch to ${label}`}
            role="button"
            aria-pressed={isActive}
        >
            <div>
                {label} ({setId})
            </div>
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
        </li>
    );
}

export default SessionItem
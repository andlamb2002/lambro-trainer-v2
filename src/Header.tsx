import { Link } from 'react-router-dom';
import { MdOutlineLightMode, MdOutlineDarkMode, MdAdd, MdRemove } from "react-icons/md";

import { useSessionStore } from "./Stores/useSessionStore";
import { useActiveSession } from "./hooks/useActiveSession";

import { useTheme } from "./hooks/useTheme";

function Header() {

    const sessions = useSessionStore(s => s.sessions);
    const activeSessionId = useSessionStore(s => s.activeSessionId);
    const setActiveSessionId = useSessionStore(s => s.setActiveSessionId);
    const handleNewSession = useSessionStore(s => s.handleNewSession);
    const handleDeleteSession = useSessionStore(s => s.handleDeleteSession);

    const { 
        enabledCases,
    } = useActiveSession();

    const { theme, toggleTheme } = useTheme();
    
    return (
        <header className="flex items-center justify-between bg-secondary px-4 py-3 sm:px-6 sm:py-4 shadow-lg gap-4">
            
            <div className="flex items-center gap-4 min-w-0">
                <Link
                    to="/"
                    className="link text-xl sm:text-2xl font-bold shrink-0"
                    title="Home"
                    aria-label="Home"
                >
                    Lambro Trainer
                </Link>

                <div className="flex items-center gap-2 min-w-0">
                    <select
                        value={activeSessionId}
                        onChange={(e) => setActiveSessionId(e.target.value)}
                        className="bg-primary text-text rounded shadow-md px-2 py-1 min-w-0 truncate cursor-pointer"
                    >
                        {sessions.map(s => (
                            <option key={s.id} value={s.id}>
                                {s.label} ({s.setId} {enabledCases.length})
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleNewSession}
                        className="btn btn-primary p-1"
                        title="New Session"
                        aria-label="New Session"
                    >
                        <MdAdd size={20} />
                    </button>
                    <button
                        onClick={handleDeleteSession}
                        disabled={sessions.length <= 1}
                        className="btn btn-danger p-1"
                        title="Delete Session"
                        aria-label="Delete Session"
                    >
                        <MdRemove size={20} />
                    </button>
                </div>
            </div>

            <button
                onClick={toggleTheme}
                className="btn btn-primary p-1 shrink-0"
                title={theme ? "Light Mode" : "Dark Mode"}
                aria-label={theme ? "Light Mode" : "Dark Mode"}
            >
                {theme ? <MdOutlineLightMode size={24} /> : <MdOutlineDarkMode size={24} />}
            </button>
        </header>
    );
}

export default Header
import { Link } from 'react-router-dom';
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";

import { useSessionStore } from "./Stores/useSessionStore";
import { useActiveSession } from "./hooks/useActiveSession";

import { useTheme } from "./hooks/useTheme";

function Header() {

    const sessions = useSessionStore(s => s.sessions);
    const activeSessionId = useSessionStore(s => s.activeSessionId);
    const setActiveSessionId = useSessionStore(s => s.setActiveSessionId);
    // const handleNewSession = useSessionStore(s => s.handleNewSession);
    // const handleDeleteSession = useSessionStore(s => s.handleDeleteSession);

    const { 
        enabledCases,
    } = useActiveSession();

    const { theme, toggleTheme } = useTheme();
    
    return (
        <header className="flex items-center justify-between bg-secondary px-2 py-4 sm:p-6 shadow-lg">
            
            <div className="flex items-center gap-4 min-w-0">
                <Link
                    to="/"
                    className="link text-xl sm:text-2xl font-bold"
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
                                {s.label} ({s.setId}) 
                            </option>
                        ))}
                    </select>
                    {enabledCases.length} Cases
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
import { Link } from 'react-router-dom';
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";

import { useSessionStore } from "./Stores/useSessionStore";
import { useTheme } from "./hooks/useTheme";

function Header() {
    const sessions = useSessionStore(s => s.sessions);
    const activeSessionId = useSessionStore(s => s.activeSessionId);
    const setActiveSessionId = useSessionStore(s => s.setActiveSessionId);
    const getSessionCount = useSessionStore(s => s.getSessionCount);

    const { theme, toggleTheme } = useTheme();
    
    return (
        <header className="flex items-center justify-between bg-secondary px-2 py-4 sm:p-6 shadow-xl">
            
            <div className="flex items-center gap-4 min-w-0">
                <Link
                    to="/"
                    className="link hidden sm:block text-2xl sm:text-2xl text-nowrap font-bold"
                    title="Home"
                    aria-label="Home"
                >
                    Lambro Trainer
                </Link>

                <Link
                    to="/"
                    className="link block sm:hidden text-xl text-nowrap font-bold"
                    title="Home"
                    aria-label="Home"
                >
                    LT
                </Link>

                <div className="flex items-center text-sm sm:text-base gap-4 min-w-0 sm:pl-6">
                    <select
                        value={activeSessionId}
                        onChange={(e) => setActiveSessionId(e.target.value)}
                        className="sm:hidden bg-primary text-text rounded shadow-md px-2 py-1 min-w-0 mr-2 truncate cursor-pointer"
                    >
                        {sessions.map(s => (
                            <option key={s.id} value={s.id}>
                                {s.label}
                            </option>
                        ))}
                    </select>
                    <select
                        value={activeSessionId}
                        onChange={(e) => setActiveSessionId(e.target.value)}
                        className="hidden sm:block bg-primary text-text rounded shadow-md px-2 py-1 min-w-0 truncate cursor-pointer"
                    >
                        {sessions.map(s => (
                            <option key={s.id} value={s.id}>
                                {s.label} ({s.setLabel})
                            </option>
                        ))}
                    </select>
                    <span className="hidden sm:inline">{getSessionCount(activeSessionId)} Cases</span>
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
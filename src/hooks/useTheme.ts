import { useState, useEffect } from "react";

export function useTheme() {
    const [theme, setTheme] = useState<boolean>(() => 
        localStorage.getItem("theme") === 'dark'
    );

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme);
        localStorage.setItem("theme", theme ? 'dark' : 'light');
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => !prev);
    }

    return { theme, toggleTheme };
}
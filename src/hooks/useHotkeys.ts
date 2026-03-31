import { useEffect } from "react";

type Hotkeys = {
    onDeleteSolve: () => void;
    onDeleteAll: () => void;
} 

export function useHotkeys({ onDeleteSolve, onDeleteAll }: Hotkeys) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!e.altKey) return;
            if (e.key.toLowerCase() === 'z') {
                e.preventDefault();
                onDeleteSolve();
            }
            if (e.key.toLowerCase() === 'd') {
                e.preventDefault();
                onDeleteAll();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onDeleteSolve, onDeleteAll]);
}
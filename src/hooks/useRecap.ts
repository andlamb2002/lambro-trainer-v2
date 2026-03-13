import { useState } from "react";

import type { Case } from "../types/types"

export function useRecap(enabledCases: Case[]) {

    const [isActive, setIsActive] = useState<boolean>(false);
    const [recapQueue, setRecapQueue] = useState<Case[]>([]);
    const [recapIndex, setRecapIndex] = useState<number>(0);
    const [recapProgress, setRecapProgress] = useState<number>(0);
    const recapLength = recapQueue.length;

    const startRecap = () => {
        if (enabledCases.length === 0) return;
        const shuffled = [...enabledCases].sort(() => Math.random() - 0.5);
        setRecapQueue(shuffled);
        setRecapIndex(1);
        setRecapProgress(0);
        setIsActive(true);

        return shuffled[0];
    };

    const stopRecap = () => {
        setIsActive(false);
        setRecapQueue([]);
        setRecapIndex(0);
        setRecapProgress(0);
    };

    const handleNextRecap = () => {
        if (recapIndex >= recapLength) {
            stopRecap();
            return null;
        }
        const nextCase = recapQueue[recapIndex];
        setRecapIndex(prev => prev + 1);
        setRecapProgress(prev => prev + 1);
        return nextCase;
    }

    // const handleDeleteRecap = () => {
    // }

    return {
        isActive,
        recapLength,
        recapProgress,
        startRecap,
        stopRecap,
        handleNextRecap,
    };
}
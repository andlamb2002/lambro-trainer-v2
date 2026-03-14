import { useState } from "react";

import type { Case } from "../types/types"

export function useRecap(enabledCases: Case[]) {

    const [isActive, setIsActive] = useState<boolean>(false);
    const [recapQueue, setRecapQueue] = useState<Case[]>([]);
    const [recapIndex, setRecapIndex] = useState<number>(0);
    const [recapProgress, setRecapProgress] = useState<number>(0);
    const recapLength = recapQueue.length;
    const [recapTotal, setRecapTotal] = useState<number>(0);

    const [recapSolveIds, setRecapSolveIds] = useState<string[]>([]);

    const startRecap = () => {
        if (enabledCases.length === 0) return;
        const shuffled = [...enabledCases].sort(() => Math.random() - 0.5);
        setRecapQueue(shuffled);
        setRecapIndex(1);
        setRecapProgress(1);
        // setRecapTotal(recapLength);
        setRecapTotal(shuffled.length);
        setIsActive(true);

        return shuffled[0];
    };

    const stopRecap = () => {
        setIsActive(false);
        setRecapQueue([]);
        setRecapIndex(0);
        setRecapProgress(0);
        setRecapSolveIds([]);
    };

    const handleNextRecap = (solveId: string) => {
        if (recapIndex >= recapLength) {
            stopRecap();
            return null;
        }
        setRecapSolveIds(prev => [...prev, solveId]);
        const nextCase = recapQueue[recapIndex];
        setRecapIndex(prev => prev + 1);
        setRecapProgress(prev => prev + 1);
        return nextCase;
    }

    const handleDeleteRecap = (solveId: string, caseId: string, cases: Case[]) => {
        if(!recapSolveIds.includes(solveId)) return;
        setRecapSolveIds(prev => prev.filter(id => id !== solveId));

        const caseToReinsert = cases.find(c => c.id === caseId);
        if (!caseToReinsert) return;

        const insertMin = recapIndex + 1;
        const insertMax = recapQueue.length;
        const insertAt = insertMin >= insertMax 
            ? insertMax
            : Math.floor(Math.random() * (insertMax - insertMin + 1)) + insertMin;

        const newQueue = [...recapQueue];
        newQueue.splice(insertAt, 0, caseToReinsert);
        setRecapQueue(newQueue);

        setRecapProgress(prev => Math.max(1, prev - 1));
        // setRecapTotal(prev => Math.max(1, prev - 1));
    }

    return {
        isActive,
        // recapIndex,
        recapTotal,
        recapProgress,
        startRecap,
        stopRecap,
        handleNextRecap,
        handleDeleteRecap,
    };
}
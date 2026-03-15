import { useRef, useState } from "react";

import type { Case } from "../types/types"

export function useRecap(enabledCases: Case[]) {

    const [isActive, setIsActive] = useState<boolean>(false);
    const recapQueueRef = useRef<Case[]>([]);

    const recapIndexRef = useRef<number>(0);
    const [recapProgress, setRecapProgress] = useState<number>(0);
    const [recapTotal, setRecapTotal] = useState<number>(0);

    const recapSolveIdsRef = useRef<string[]>([]);

    const startRecap = (firstCase?: Case) => {
        if (enabledCases.length === 0) return;

        let shuffled: Case[] = [];
        if (firstCase) {
            const remainingCases = enabledCases.filter(c => c.id !== firstCase.id);
            shuffled = [firstCase, ...remainingCases.sort(() => Math.random() - 0.5)];
        }
        else {
            shuffled = [...enabledCases].sort(() => Math.random() - 0.5);
        }

        recapQueueRef.current = shuffled;
        recapIndexRef.current = 0;
        setRecapProgress(1);
        setRecapTotal(shuffled.length);
        setIsActive(true);

        return shuffled[0];
    };

    const stopRecap = () => {
        setIsActive(false);
        recapQueueRef.current = [];
        recapIndexRef.current = 0;
        setRecapProgress(0);
        setRecapTotal(0);
        recapSolveIdsRef.current = [];
    };

    const handleNextRecap = (solveId: string) => {
        if (recapIndexRef.current >= recapQueueRef.current.length - 1) {
            stopRecap();
            return null;
        }
        recapSolveIdsRef.current = [...recapSolveIdsRef.current, solveId];
        recapIndexRef.current += 1;
        const nextCase = recapQueueRef.current[recapIndexRef.current];
        setRecapProgress(prev => prev + 1);
        return nextCase;
    }

    const handleDeleteRecap = (solveId: string, caseId: string, cases: Case[]) => {
        if(!recapSolveIdsRef.current.includes(solveId)) return;
        recapSolveIdsRef.current = recapSolveIdsRef.current.filter(id => id !== solveId);

        const caseToReinsert = cases.find(c => c.id === caseId);
        if (!caseToReinsert) return;

        const insertMin = recapIndexRef.current + 1;
        const insertMax = recapQueueRef.current.length;
        const insertAt = insertMin >= insertMax 
            ? insertMax
            : Math.floor(Math.random() * (insertMax - insertMin + 1)) + insertMin;

        const newQueue = [...recapQueueRef.current];
        newQueue.splice(insertAt, 0, caseToReinsert);
        recapQueueRef.current = newQueue;

        setRecapProgress(prev => Math.max(1, prev - 1));
    }

    const handleDeleteAllRecap = (currentCase: Case) => {
        if (!isActive) return;
        startRecap(currentCase);
    };

    return {
        isActive,
        recapTotal,
        recapProgress,
        startRecap,
        stopRecap,
        handleNextRecap,
        handleDeleteRecap,
        handleDeleteAllRecap,
    };
}
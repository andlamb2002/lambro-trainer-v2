import { useRef, useState } from "react";

import type { Case, RecapState } from "../types/types"

export function useRecap(enabledCases: Case[], initialRecap: RecapState | null, onRecapChange: (recapState: RecapState | null) => void) {

    const [isActive, setIsActive] = useState<boolean>(initialRecap ? initialRecap.isActive : false);
    const recapQueueRef = useRef<Case[]>(initialRecap ? initialRecap.queue : []);

    const recapIndexRef = useRef<number>(initialRecap ? initialRecap.index : 0);
    const [recapProgress, setRecapProgress] = useState<number>(initialRecap ? initialRecap.progress : 0);
    const [recapTotal, setRecapTotal] = useState<number>(initialRecap ? initialRecap.total : 0);

    const recapSolveIdsRef = useRef<string[]>(initialRecap ? initialRecap.solveIds : []);

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
        recapSolveIdsRef.current = [];

        onRecapChange({
            isActive: true,
            queue: shuffled,
            index: 0,
            progress: 1,
            total: shuffled.length,
            solveIds: [],
        });

        return shuffled[0];
    };

    const stopRecap = () => {
        setIsActive(false);
        recapQueueRef.current = [];
        recapIndexRef.current = 0;
        setRecapProgress(0);
        setRecapTotal(0);
        recapSolveIdsRef.current = [];

        onRecapChange(null);
    };

    const handleNextRecap = (solveId: string) => {
        if (recapIndexRef.current >= recapQueueRef.current.length - 1) {
            stopRecap();
            return null;
        }
        recapSolveIdsRef.current = [...recapSolveIdsRef.current, solveId];
        recapIndexRef.current += 1;
        const nextCase = recapQueueRef.current[recapIndexRef.current];
        const newProgress = recapProgress + 1;
        setRecapProgress(newProgress);

        onRecapChange({
            isActive: true,
            queue: recapQueueRef.current,
            index: recapIndexRef.current,
            progress: newProgress,
            total: recapTotal,
            solveIds: recapSolveIdsRef.current,
        });
        
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

        const newProgress = Math.max(1, recapProgress - 1);
        setRecapProgress(newProgress);

        onRecapChange({
            isActive: true,
            queue: recapQueueRef.current,
            index: recapIndexRef.current,
            progress: newProgress,
            total: recapTotal,
            solveIds: recapSolveIdsRef.current,
        });
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
import { create } from 'zustand'
import type { Case } from '../../types/types';

type CaseStore = {
    currentCase: Case | null;
    currentScramble: string;
    setCaseAndScramble: (caseAndScramble: { currentCase: Case | null; currentScramble: string }) => void;
}

export const useCaseStore = create<CaseStore>((set) => ({
    currentCase: null,
    currentScramble: '',
    setCaseAndScramble: (caseAndScramble) =>
        set({
            currentCase: caseAndScramble ? caseAndScramble.currentCase : null,
            currentScramble: caseAndScramble ? caseAndScramble.currentScramble : '',
        }),
}));
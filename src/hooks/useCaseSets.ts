import { useMemo } from "react";

import type { Case, Subset } from "../types/types";

export function useCaseSets(cases: Case[], subsets?: Subset[]) {

    const sets = useMemo(() => {
        const s = new Set<string>();
        cases.forEach(c => s.add(c.set));
        return Array.from(s);
    }, [cases]);

    const casesBySet = useMemo(() => {
        const map = new Map<string, Case[]>();
        cases.forEach(c => {
            const arr = map.get(c.set) ?? [];
            arr.push(c);
            map.set(c.set, arr);
        });
        return map;
    }, [cases]);

    const subsetsBySet = useMemo(() => {
        if (!subsets) return new Map<string, Subset[]>();
        const map = new Map<string, Subset[]>();
        subsets.forEach(s => {
            const arr = map.get(s.set) ?? [];
            arr.push(s);
            map.set(s.set, arr);
        });
        return map;
    }, [subsets]);

    const casesBySubset = useMemo(() => {
        const map = new Map<string, Case[]>();
        cases.forEach(c => {
            if (c.subset) {
                const arr = map.get(c.subset) ?? [];
                arr.push(c);
                map.set(c.subset, arr);
            }
        });
        return map;
    }, [cases]);

    return {
        sets,
        casesBySet,
        subsetsBySet,
        casesBySubset,
    }
}
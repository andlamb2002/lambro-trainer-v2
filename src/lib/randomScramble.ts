import type { Case } from '../types/types'

function randomIndex(len: number): number {
  return Math.floor(Math.random() * len);
}

export function getRandomCase(cases: Case[]): Case {
    // TODO: filter cases based on user selection
    return cases[randomIndex(cases.length)];
}

export function getRandomScrambleFromCase(c: Case): string {
    const scrambles = c.scrambles;
    return scrambles[randomIndex(scrambles.length)];
}

export function getRandomCaseAndScramble(cases: Case[]): { case: Case, scramble: string } {
    const c = getRandomCase(cases);
    const scramble = getRandomScrambleFromCase(c);
    return { case: c, scramble };
}
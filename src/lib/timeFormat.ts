export function formatTime(ms: number): string {
    return (ms / 1000).toFixed(2);
}

export function formatRunningTime(ms: number): string {
    return Math.floor(ms / 1000).toString();
}
export function formatTime(ms: number): string {
    return (ms / 1000).toFixed(2);
}

export function formatRunningTime(ms: number): string {
    return Math.floor(ms / 1000).toString();
}

export function formatSetName(name: string): string {
    return name
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export function removeLastUMove(scramble: string): string {
    return scramble.replace(/(U'|U2|U)$/, '');
}
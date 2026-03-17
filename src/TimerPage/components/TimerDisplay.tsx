import { formatTime, formatRunningTime } from '../../lib/timeFormat'

import type { Phase } from '../../types/types';

type Props = {
    phase: Phase;
    time: number;
}

function TimerDisplay({ phase, time }: Props) {
    return (
        <div>
            {phase}
            {phase === 'running' ? 
                    <>{formatRunningTime(time)}</>
                :
                <>{formatTime(time)}</>
            }
        </div>
    )
}

export default TimerDisplay
import { Link } from "react-router-dom";

type Props = {
    currentScramble: string;
    isActive: boolean;
    recapProgress: number;
    recapTotal: number;
    handleStartRecap: () => void;
    stopRecap: () => void;
}

function ScrambleBar({ currentScramble, isActive, recapProgress, recapTotal, handleStartRecap, stopRecap }: Props) {
    return (
        <>
            <Link to="/cases">Cases</Link>
            <div>
                {isActive 
                    ? <button onClick={stopRecap}>End Recap</button>
                    : <button onClick={handleStartRecap}>Recap</button>
                }
                {isActive && <>{recapProgress} / {recapTotal}</>}
            </div>
            <div>
                {currentScramble}
            </div>
        </>
    )
}

export default ScrambleBar
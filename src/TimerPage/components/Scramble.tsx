import type { Case } from '../../types/types'

type Props = {
    currentCase: Case | null;
    currentScramble: string;
    nextCase: () => void;
}

function Scramble({ currentCase, currentScramble, nextCase }: Props) {
  return (
    <>
        <div>{currentCase ? currentCase.label : ""}</div>
        <div>{currentScramble}</div>
        <button onClick={nextCase}>Next</button>
    </>
  )
}

export default Scramble
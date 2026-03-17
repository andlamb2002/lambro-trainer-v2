type Props = {
    currentScramble: string;
}

function ScrambleBar({ currentScramble }: Props) {
  return (
    <>
        <div>{currentScramble}</div>
    </>
  )
}

export default ScrambleBar
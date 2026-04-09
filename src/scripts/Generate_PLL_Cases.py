from utils import load_json, save_json, generate_case, scrambles_from_base_sequence

PLL_OVERRIDES = {
    "PLL09": [
        "L2 F' B' L2 F B' L2 B2 L2 U2 B2",
        "L R U2 R2 U' D' F2 U D L' R",
        "L' R' B2 D2 L2 U2 F2 L2 D2 L R'",
        "L2 D2 R L' U2 L2 D2 B2 R L B2",
        "L2 B2 D2 F' B U2 F' B' R2 D2 B2",
        "F B L2 U2 F2 U2 L2 F2 U2 F B'"
    ],
    "PLL21": [
        "L' R F' U2 D2 F U2 D2 F' L R' D2",
        "D2 R L' F' U2 D2 F U2 D2 F' R' L",
        "L2 U R2 B2 U' F2 L2 B2 D' F2 U' L2 U",
        "L2 F2 R2 L2 B2 R2 U R2 L2 D R2 L2",
        "D L2 U L2 D' B2 R2 B2 U' R2 U B2 R2",
        "D L2 B2 U L2 U' B2 L2 B2 D' R2 U R2"
    ],
}

def process_pll(pll_data):
    cases = []
    counter = 1
    for pll in pll_data:
        if pll["label"].lower() == "skip":
            continue

        case_id = f"PLL{str(counter).zfill(2)}"

        if case_id in PLL_OVERRIDES:
            scrambles = PLL_OVERRIDES[case_id]
            print(f"{pll['label']}: {len(scrambles)} custom scrambles (override)")
        else:
            scrambles = scrambles_from_base_sequence(pll["scramble"], max_solutions=4)
            print(f"{pll['label']}: {len(scrambles)} scrambles")

        cases.append(generate_case(
            case_id=case_id,
            label=pll["label"],
            scrambles=scrambles,
            original_alg=pll["scramble"],
            set_name=pll["set"]
        ))
        counter += 1
    return cases

def main():
    pll_data = load_json("pll.json")
    all_cases = process_pll(pll_data)
    save_json(all_cases, "pll_cases.json")

if __name__ == "__main__":
    main()

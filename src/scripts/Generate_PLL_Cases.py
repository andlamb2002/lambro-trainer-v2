from utils import load_json, save_json, generate_case, scrambles_from_base_sequence

def process_pll(pll_data):
    cases = []
    counter = 1
    for pll in pll_data:
        if pll["label"].lower() == "skip":
            continue

        scrambles = scrambles_from_base_sequence(pll["scramble"], max_solutions=4)

        case_id = f"PLL{str(counter).zfill(2)}"
        cases.append(generate_case(
            case_id=case_id,
            label=pll["label"],
            scrambles=scrambles,
            original_alg=pll["scramble"],
            set_name=pll["set"]
        ))
        print(f"{pll['label']}: {len(scrambles)} scrambles")
        counter += 1
    return cases

def main():
    pll_data = load_json("pll.json")
    all_cases = process_pll(pll_data)
    save_json(all_cases, "pll_cases.json")

if __name__ == "__main__":
    main()

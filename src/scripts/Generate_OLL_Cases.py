from utils import load_json, save_json, invert_alg, get_auf_moves, generate_case, generate_scramble

def process_oll(oll_data: list[dict], pll_data: list[dict]):
    cases = []
    counter = 1
    for oll in oll_data:
        if oll["label"].lower() == "skip":
            continue

        inv_oll = invert_alg(oll["scramble"])
        scrambles = []

        for pll in pll_data:
            for auf in get_auf_moves(pll["label"]):
                scrambles.append(invert_alg(generate_scramble(pll, auf, inv_oll)))

        case_id = f"OLL{str(counter).zfill(2)}"
        output_label = case_id

        cases.append(generate_case(
            case_id,
            output_label,
            scrambles,
            oll["scramble"],
            set_name=oll["set"],
            img_stage="oll",
            shape=oll["label"]
        ))
        print(f"{oll['label']}: {len(scrambles)} scrambles")
        counter += 1

    return cases

def main():

    pll_data = load_json("pll.json")
    oll_data = load_json("oll.json")
    all_cases = process_oll(oll_data, pll_data)
    save_json(all_cases, "oll_cases.json")

if __name__ == "__main__":
    main()
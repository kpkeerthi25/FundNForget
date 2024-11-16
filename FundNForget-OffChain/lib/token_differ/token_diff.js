
/*
    oldRatios: map[token(string), ratios(int [1, 100])]
    newRatios: map[token(string), ratios(int [1, 100])]
    returns: list[{fromToken, toToken, quantity}] -> convert {quantity}% of {fromToken} to {toToken}
*/
export function generateTokenDiffs(oldRatios, newRatios) {
    // [token, ratio diff]
    const increases = new Map();
    const decreases = new Map();

    for (const [key, value] of oldRatios.entries()) {
        if (newRatios.has(key)) {
            if (newRatios.get(key) > oldRatios.get(key)) {
                increases.set(key, newRatios.get(key) - oldRatios.get(key));
            } else if (newRatios.get(key) < oldRatios.get(key)) {
                decreases.set(key, oldRatios.get(key) - newRatios.get(key));
            }
        } else {
            decreases.set(key, oldRatios.get(key));
        }
    }

    for (const [key, value] of newRatios.entries()) {
        if (!oldRatios.has(key)) {
            increases.set(key, value);
        }
    }

    const diffs = [];

    for (const key of decreases.keys()) {
        let currValue = decreases.get(key);
        for (const key2 of increases.keys()) {
            let incValue = increases.get(key2);

            if (currValue >= incValue) {
                diffs.push({ key, key2, incValue });
                currValue -= incValue;
                increases.delete(key2);
            } else {
                diffs.push({ key, key2, currValue });
                incValue -= currValue;
                currValue = 0;
                increases.set(key2, incValue);
            }

            if (currValue == 0) {
                break;
            }
        }
    }

    return diffs;
}
const randomizer = (number) => {
    return Number(number + Math.floor(Math.random() * Date.now()).toString().slice(0,8));
}

const getRates = () => ({
    USD: {
        EUR: randomizer(0.82),
        GBP: randomizer(0.71),
        USD: 1,
    },
    EUR: {
        USD: randomizer(1.22),
        GBP: randomizer(0.86),
        EUR: 1,
    },
    GBP: {
        USD: randomizer(1.42),
        EUR: randomizer(1.16),
        GBP: 1,
    },
});

const date = new Date().toLocaleDateString('en-CA');

export default async function handler(req, res) {
    const { base, symbols } = req.query;
    res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400');

    const rates = getRates();

    if (!base) {
        return res.json({
            date,
            rates,
        });
    }

    if (!rates[base]) {
        return res.json({
            error: "Base not found"
        });
    }

    let currencies = [];
    if (symbols) {
        currencies = symbols.split(",");
    }

    if (currencies.length > 0) {
        const filtered = Object.keys(rates[base])
            .filter(key => currencies.includes(key))
            .reduce((obj, key) => {
                obj[key] = rates[base][key];
                return obj;
            }, {});

        return res.json({
            base,
            date,
            rates: filtered,
        });
    }

    return res.json({
        base,
        date,
        rates: rates[base],
    });
}


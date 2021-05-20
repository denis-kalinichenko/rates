const rates = {
    USD: {
        EUR: 0.8195,
        GBP: 0.708,
        USD: 1,
    },
    EUR: {
        USD: 1.2203,
        GBP: 0.864,
        EUR: 1,
    },
    GBP: {
        USD: 1.4123,
        EUR: 1.1574,
        GBP: 1,
    },
};

const date = new Date().toLocaleDateString('en-CA');

export default async function handler(req, res) {
    const { base, symbols } = req.query;
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400');

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


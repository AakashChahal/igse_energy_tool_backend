class Tariff {
    constructor(tariff_type, rate) {
        this.tariff_type = tariff_type;
        this.rate = rate;
    }

    getTariffType() {
        return this.tariff_type;
    }

    getRate() {
        return this.rate;
    }

    setTariffType(tariff_type) {
        this.tariff_type = tariff_type;
    }

    setRate(rate) {
        this.rate = rate;
    }
}

export default Tariff;

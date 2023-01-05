class Reading {
    constructor(
        customer_id,
        submission_date,
        elec_reading_day,
        elec_reading_night,
        gas_reading,
        status
    ) {
        this.customer_id = customer_id;
        this.submission_date = submission_date;
        this.elec_reading_day = elec_reading_day;
        this.elec_reading_night = elec_reading_night;
        this.gas_reading = gas_reading;
        this.status = status;
    }

    changeStatus(status) {
        this.status = status;
    }
}

export default Reading;

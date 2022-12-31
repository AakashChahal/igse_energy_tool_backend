class Voucher {
    constructor(evc_code, used = false) {
        this.evc_code = evc_code;
        this.used = used;
    }

    useVoucher() {
        this.used = true;
    }
}

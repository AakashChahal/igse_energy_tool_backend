class User {
    constructor(
        first_name,
        last_name,
        customer_id,
        password,
        address,
        property_type,
        num_bedroom,
        balance,
        type
    ) {
        this.full_name = first_name + " " + last_name;
        this.customer_id = customer_id;
        this.password = password;
        this.address = address;
        this.property_type = property_type;
        this.num_bedroom = num_bedroom;
        this.balance = balance;
        this.type = type;
    }
}

export default User;

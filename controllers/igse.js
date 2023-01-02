import * as firebase from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import { connect, firebaseConfig } from "../app.js";
import { createError } from "../utils/error.js";

export const countProperties = async (req, res, next) => {
    try {
        const firebaseApp = firebase.initializeApp(firebaseConfig);
        const database = getDatabase(firebaseApp);
        const auth = getAuth();
        const dbRef = ref(database, `customers`);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            const properties = {
                detached: 0,
                "semi-detached": 0,
                terraced: 0,
                flat: 0,
                bunglow: 0,
                cottage: 0,
                mansion: 0,
            };
            const customers = snapshot.val();
            for (const customer in customers) {
                if (customers[customer].property_type in properties)
                    properties[customers[customer].property_type]++;
            }
            res.status(200).json([{ ...properties }]);
        } else {
            res.status(404).json({
                message: "Not enough data",
            });
        }
    } catch (err) {
        next(createError(err));
    }
};

export const calcEnergy = async (req, res, next) => {
    try {
        const firebaseApp = firebase.initializeApp(firebaseConfig);
        const database = getDatabase(firebaseApp);
        const auth = getAuth();
        const dbRef = ref(database, `customers`);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            const customers = snapshot.val();
            const customerWithPropertyType = [];
            for (const customer in customers) {
                if (
                    customers[customer].property_type ==
                        req.params.property_type &&
                    customers[customer]["num_bedrooms"] ===
                        req.params.num_bedrooms
                )
                    customerWithPropertyType.push(customers[customer]);
            }
            let tot_energy = 0;
            try {
                for (const customer of customerWithPropertyType) {
                    const energyDBRef = ref(
                        database,
                        `readings/${customer.customer_id
                            .split("@")[0]
                            .replace(/[.#$\\]/g, "_")}`
                    );
                    const energySnapshot = await get(energyDBRef);
                    if (energySnapshot.exists()) {
                        const energy = energySnapshot.val();
                        for (const reading in energy) {
                            tot_energy +=
                                energy[reading].elec_reading_day +
                                energy[reading].elec_reading_night +
                                energy[reading].gas;
                        }
                        res.status(200).json({
                            type: req.params.property_type,
                            bedroom: parseInt(req.params.numBedrooms),
                            average_electricity_gas_cost_per_day: parseFloat(
                                (tot_energy / 30).toFixed(2)
                            ),
                            unit: "pound",
                        });
                    } else {
                        res.status(404).json({
                            message: "Not enough data",
                        });
                    }
                }
            } catch (err) {
                next(createError(err));
            }
        } else {
            res.status(404).json({
                message: "Not enough data",
            });
        }
    } catch (err) {
        next(createError(err));
    }
};

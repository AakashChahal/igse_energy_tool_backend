import * as firebase from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "../app.js";

export const getStats = async (req, res, next) => {
    try {
        const firebaseApp = firebase.initializeApp(firebaseConfig);
        const database = getDatabase(firebaseApp);
        const auth = getAuth();
        const dbRef = ref(database, "readings/");
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            const readings = snapshot.val();
            const stats = {};
            for (const customer in readings) {
                for (const reading_id in readings[customer]) {
                    const reading = readings[customer][reading_id];
                    if (stats.day) {
                        stats.day += parseFloat(
                            reading.electricity_meter_reading_day
                        );
                    } else {
                        stats.day = parseFloat(
                            reading.electricity_meter_reading_day
                        );
                    }

                    if (stats.night) {
                        stats.night += parseFloat(
                            reading.electricity_meter_reading_night
                        );
                    } else {
                        stats.night = parseFloat(
                            reading.electricity_meter_reading_night
                        );
                    }

                    if (stats.gas) {
                        stats.gas += parseFloat(reading.gas_meter_reading);
                    } else {
                        stats.gas = parseFloat(reading.gas_meter_reading);
                    }
                }
            }
            res.status(200).json(stats);
        } else {
            res.status(404).json({
                message: "Stats not found",
            });
        }
    } catch (err) {
        next(err);
    }
};

import axios from "axios";
import { COUNTRY_API } from "../common/constants";

const services = {
  getCountries: async (cb) => {
    return await axios
      .get(COUNTRY_API)
      .then((values) => {
        if (values?.data?.docs && values?.data?.docs?.length) {
          cb([{ name: "All", id: -1 }, ...values.data.docs]);
        }
      })
      .catch((error) => {
        console.log("error: ", error);
        cb(null, error);
      });
  },
};

export default services;

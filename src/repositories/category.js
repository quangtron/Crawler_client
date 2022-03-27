import axios from "axios";
import { CATEGORY_API } from "../common/constants";

const services = {
  getCategories: async (cb) => {
    return await axios
      .get(CATEGORY_API)
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

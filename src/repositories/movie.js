import axios from "axios";
import { MOVIE_API, PAGE_LIMIT } from "../common/constants";

const services = {
  getMovies: async (filters = "", offset = 0, limit = PAGE_LIMIT, cb) => {
    return await axios
      .get(`${MOVIE_API}?${filters}offset=${offset}&limit=${limit}`)
      .then((value) => {
        if (value?.data?.docs && value?.data?.docs?.length) {
          cb(value.data, null);
        }
      })
      .catch((error) => {
        console.log("error: ", error);
        cb(null, error);
      });
  },
};

export default services;

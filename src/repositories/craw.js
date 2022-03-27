import axios from "axios";

const services = {
  crawToDB: async (url, params, cb) => {
    return await axios
      .post(url, params)
      .then((value) => {
        if (value?.data?.status && value?.data?.status === 200) {
          cb(true, null);
        } else {
          cb(false, null);
        }
      })
      .catch((error) => {
        console.log("error: ", error);
        cb(null, error);
      });
  },
};

export default services;

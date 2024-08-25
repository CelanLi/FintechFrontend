import axios from "axios";
import qs from "qs";

axios.defaults.baseURL = "http://localhost:8000/api";
axios.defaults.timeout = 50000;

/**
 * get function
 * @param url
 * @param params
 * @returns {Promise<AxiosResponse<any>> | *}
 */
function doGet(url, params) {
  return axios({
    method: "get",
    url: url,
    params: params,
  });
}

/**
 * pass json data in the body
 * @param url
 * @param data
 * @returns {Promise<AxiosResponse<any>> | *}
 */
function doPostJson(url, data) {
  return axios({
    method: "post",
    url: url,
    data: data,
  });
}

function doPost(url, params) {
  // qs can convert the json object to form data
  let requestData = qs.stringify(params);
  return axios.post(url, requestData)
}


// export the function
export { doGet, doPostJson, doPost };
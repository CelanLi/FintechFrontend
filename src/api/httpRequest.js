import axios from "axios";

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


// export the function
export { doGet, doPostJson };
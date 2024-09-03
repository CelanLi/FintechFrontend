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
  console.log("post json data", data)
  return axios.post(url, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function doPost(url, params) {
  // qs can convert the json object to form data
  let requestData = qs.stringify(params);
  return axios.post(url, requestData)
}

// request interceptor
axios.interceptors.request.use(
  (config) => {
    // when need jwt token, add token in the request header
    // check if token is needed
    console.log(config.url)
    if (config.url == '/v1/user/realname' || config.url == '/v1/user/usercenter' || config.url == '/v1/recharge/records'){
      let token = localStorage.getItem('token');
      let userInfo = localStorage.getItem('user');
      if (token && userInfo) {
        config.headers.Authorization = 'Bearer ' + token;
        config.headers['uid'] = JSON.parse(userInfo).uid;
      }
    }
    return config;
  },
  (error) => {
    console.log("request error", error);
    return Promise.reject(error);
  }
);

// response interceptor
// when code > 1000, it means the request failed
axios.interceptors.response.use(function (resp){
    console.log("response success1", resp);
  if (resp && resp.data && resp.data.code>1000){
    let code = resp.data.code;
    if (code === 3000){
      // token invalid, login again
        window.location.href = '/page/user/login';
    }
    else {
      console.log("response error", resp);
      alert(resp.data.msg);
    }
  }
  return resp;
}, function (error){
  console.log("response error2", error);
  // get back to main page
  //window.location.href = '/';
    }
);


// export the function
export { doGet, doPostJson, doPost };
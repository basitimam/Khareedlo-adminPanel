import forEach from "lodash.foreach";
import axios from "axios";

const api = `http://localhost:3001/api`;

const createParams = (listOfParams) => {
  let array = [];
  forEach(listOfParams, (paramValue, paramKey) => {
    array.push(
      encodeURIComponent(paramKey) + "=" + encodeURIComponent(paramValue)
    );
  });
  return array.join("&");
};

const buildUrl = (endpointUrl, params, apiType = null) => {
  const firstEndpointUrlChar = endpointUrl.charAt(0);
  const addSlash = firstEndpointUrlChar === "/" ? "" : "/";
  let url = api + addSlash + endpointUrl;
  url = !url.endsWith("/") ? url + "/" : url;
  url = params ? url + "?" + createParams(params) : url;
  return url;
};

const fetchToken = (passedToken) => {
  if (passedToken) {
    return `${passedToken}`;
  }
  const token = `${localStorage.getItem("token")}`;
  return token;
};

export const getRequest = (url, params = null, hasHeaders, passedToken) => {
  const token = fetchToken(passedToken);

  return axios.get(
    `${buildUrl(url, params)}`,
    hasHeaders
      ? {
          headers: {
            "x-access-token": token,
          },
        }
      : null
  );
};

export const postRequest = (url, params = null, hasHeaders, data, apiType) => {
  const token = fetchToken();
  return axios.post(
    `${buildUrl(url, params, apiType)}`,
    { ...data },
    hasHeaders
      ? {
          headers: {
            "x-access-token": token,
          },
        }
      : null
  );
};

export const putRequest = (url, params = null, hasHeaders, data, apiType) => {
  const token = fetchToken();
  return axios.put(
    `${buildUrl(url, params, apiType)}`,
    { ...data },
    hasHeaders
      ? {
          headers: {
            "x-access-token": token,
          },
        }
      : null
  );
};

export const deleteRequest = (url, params = null, hasHeaders, data) => {
  const token = fetchToken();
  return axios.delete(
    `${buildUrl(url, params)}`,
    hasHeaders
      ? {
          headers: {
            "x-access-token": token,
          },
          data: { ...data },
        }
      : { data: { ...data } }
  );
};

export const getAPIUrl = () => {
  return api;
};

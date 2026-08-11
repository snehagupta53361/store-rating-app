const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}/${endpoint.replace(/^\//, "")}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  const text = await response.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch (e) {
    throw new Error("Invalid server response");
  }

  if (!response.ok) {
    let errMsg = json.message || `Error! status: ${response.status}`;
    if (json.errors && json.errors.length > 0) {
      const fieldErrors = json.errors
        .map((e) => `${e.path || e.field || "field"}: ${e.msg || e.message}`)
        .join(", ");
      errMsg = `${json.message} (${fieldErrors})`;
    }
    throw new Error(errMsg);
  }

  return json; // Contains: { success, statusCode, message, data }
};

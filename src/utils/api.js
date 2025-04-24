import store  from "../redux/store";

export const API_URL = "https://localhost:7081/api";

export const fetchWithAuth = async (endpoint, options = {}) => {
  const state = store.getState();
  const token = state.user.token;

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` })
  };

  // Se non stai usando FormData, imposta Content-Type
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  return response;
};

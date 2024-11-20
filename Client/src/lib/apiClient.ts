import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
const base = import.meta.env.VITE_BASE_URL;


export const isAuthenticated = (): boolean => {
  const token = Cookies.get("authToken");
  if (!token) return false;
  try {
    const decodedToken = jwtDecode<{ exp: number }>(token);
    return decodedToken.exp > Date.now() / 1000;
  } catch (error) {
    return false;
  }
};


export const getToken = () => {
  const token = Cookies.get("authToken");
  if (!token) {
    window.location.href = "/login";
    return null;
  }
  try {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp && decodedToken.exp < Date.now() / 1000) {
      window.location.href = "/login";
      return null;
    }
    return token;
  } catch (error) {
    Cookies.remove("authToken");
    window.location.href = "/login";
    return null;
  }
};
const config = {
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "same-origin",
};

export const getRequest = async (path: string) => {
  const url = `${base}/${path}`;
  try {
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postRequest = async (path: string, data: object) => {
  const url = `${base}/${path}`;

  try {
    const response = await axios.post(url, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAuthRequest = async (path: string, alt?: boolean) => {
  const url = `${base}/${path}`;
  const AuthConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    credentials: "same-origin",
  };
  try {
    const response = await axios.get(url, AuthConfig);
    if (alt) {
      return response;
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postAuthRequest = async (path: string, data: object) => {
  const url = `${base}/${path}`;
  const AuthConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    credentials: "same-origin",
  };
  try {
    const response = await axios.post(url, data, AuthConfig);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const patchAuthRequest = async (path: string, data: object) => {
	const url = `${base}/${path}`;
	const AuthConfig = {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${getToken()}`,
		},
		credentials: "same-origin",
	};
	try {
    const response = await axios.patch(url, data, AuthConfig);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAuthRequest = async (path: string) => {
	const url = `${base}/${path}`;
	const AuthConfig = {
		headers: {
			"Content-Type": "application/json", 
			Authorization: `Bearer ${getToken()}`,
		},
		credentials: "same-origin",
	};
	try {
		const response = await axios.delete(url, AuthConfig);
		return response.data;
	} catch (error) {
		throw error;
	}
};

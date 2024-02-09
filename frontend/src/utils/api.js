import axios from 'axios';
import { USER_URLS } from '../constants/urls';

// register api call
export const registerUser = async (data) => {
  try {
    const res = await axios.post(`${USER_URLS}/register`, data);
    if (res?.data && res?.data?.success) {
      return res?.data;
    } else {
      return res?.data;
    }
  } catch (error) {
    return error?.response?.data;
  }
};

// login api call
export const loginUser = async (data) => {
  try {
    const res = await axios.post(`${USER_URLS}/login`, data);
    if (res?.data && res?.data?.success) {
      localStorage.setItem('userInfo', JSON.stringify(res?.data));
      return res?.data;
    } else {
      return res?.data;
    }
  } catch (error) {
    return error?.response?.data;
  }
};

export const logoutUser = async () => {
  try {
    const res = await axios.get(`${USER_URLS}/logout`);
    if (res?.data && res?.data?.success) {
      localStorage.clear();
      return res?.data;
    } else {
      return res?.data;
    }
  } catch (error) {
    return error?.response?.data;
  }
};

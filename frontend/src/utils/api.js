import axios from 'axios';
import { TODO_URLS, USER_URLS } from '../constants/urls';

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

// logout api call
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

// Create todo api call
export const createTodo = async (data) => {
  try {
    const res = await axios.post(TODO_URLS, data);
    if (res?.data && res?.data?.success) {
      return res?.data;
    } else {
      return res?.data;
    }
  } catch (error) {
    return error?.response?.data;
  }
};

// Get all todos api call
export const getTodos = async () => {
  try {
    const res = await axios.get(TODO_URLS);
    if (res?.data && res?.data?.success) {
      return res?.data;
    } else {
      return res?.data;
    }
  } catch (error) {
    return error?.response?.data;
  }
};

// Get single todo api call
export const getTodo = async (id) => {
  try {
    const res = await axios.get(`${TODO_URLS}/${id}`);
    if (res?.data && res?.data?.success) {
      return res?.data;
    } else {
      return res?.data;
    }
  } catch (error) {
    return error?.response?.data;
  }
};

// Update todo api call
export const updateTodo = async (todoId, status) => {
  try {
    const res = await axios.put(`${TODO_URLS}/${todoId}`, status);
    if (res?.data && res?.data?.success) {
      return res?.data;
    } else {
      return res?.data;
    }
  } catch (error) {
    return error?.response?.data;
  }
};

// Delete todo api call
export const deleteTodo = async (id) => {
  try {
    const res = await axios.delete(`${TODO_URLS}/${id}`);
    if (res?.data && res?.data?.success) {
      return res?.data;
    } else {
      return res?.data;
    }
  } catch (error) {
    return error?.response?.data;
  }
};

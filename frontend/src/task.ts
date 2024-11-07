import axios from "axios";

const API_URL = "http://localhost:3000/tasks";

export interface Task {
  id?: string;
  title: string;
  description?: string;
}

export const getTasks = async (page: number = 1): Promise<Task[]> => {
  const response = await axios.get(`${API_URL}?page=${page}`);
  return response.data;
};

export const getTask = async (id: string): Promise<Task> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createTask = async (task: Omit<Task, "id">): Promise<Task> => {
  const response = await axios.post(API_URL, task);
  return response.data;
};

export const updateTask = async (
  id: string,
  task: Partial<Task>
): Promise<Task> => {
  const response = await axios.put(`${API_URL}/${id}`, task);
  return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

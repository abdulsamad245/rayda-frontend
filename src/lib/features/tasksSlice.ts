import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios  from "../axios";
import { AxiosError } from "axios";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  due_date: string;
  status: string
  created_at: string;
  updated_at: string;
}

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
};

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (page?: number) => {
    try {
      const response = await axios.get(`/tasks?page=${page ?? 1}&per_page=${5}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw new Error(`${axiosError?.message}!` || "Failed to fetch tasks!");
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData: { title: string; description: string }) => {
    try {
      const response = await axios.post("/tasks", {...taskData, status : "pending"});
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw new Error(`${axiosError?.message}!` || "Failed to create tasks!");

    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (taskData: { id: number; title: string; description: string; completed: boolean; due_date: string; status: string }) => {
    try {
      const response = await axios.put(`/tasks/${taskData.id}`, taskData);
      return response.data;
    } catch (error) {
      
      const axiosError = error as AxiosError<{ message: string }>;
      throw new Error(`${axiosError?.message}!` || "Failed to update tasks!");

    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id: number) => {
    try {
      await axios.delete(`/tasks/${id}`);
      return id;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw new Error(`${axiosError?.message}!` || "Failed to delete tasks!");

    }
  }
);

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.data.data;
        state.currentPage = action.payload.data.current_page;
        state.totalPages = action.payload.data.last_page;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tasks!";
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload.data);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.error.message || "Failed to create task!";
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((task) => task.id === action.payload.data.id);
        if (index !== -1) {
          state.tasks[index] = action.payload.data;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update task!";
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete task!";
      });
  },
});

export default tasksSlice.reducer;

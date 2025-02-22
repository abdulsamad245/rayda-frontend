"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateTask,
  deleteTask,
  fetchTasks,
} from "../../../lib/features/tasksSlice";
import { store, type AppDispatch, type RootState } from "../../../lib/store";
import { showToast } from "../../../lib/toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  formatDateForInput,
  formatReadableDate,
  formatStatus,
} from "@/lib/utils/format";
import { Loader } from "lucide-react";

interface Task {
  id: number;
  title: string;
  description: string;
  due_date: string;
  status: string;
  completed: boolean;
}

const validationSchema = Yup.object({
  title: Yup.string().required("Task title is required"),
  description: Yup.string(),
});

export default function TaskList() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    tasks: reduxTasks,
    loading,
    currentPage,
    totalPages,
  } = useSelector((state: RootState) => state.tasks);
  const [tasks, setTasks] = useState<Task[]>(reduxTasks);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      await store.dispatch(fetchTasks(1));
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (reduxTasks) {
      setTasks(reduxTasks);
    }
  }, [reduxTasks]);

  const handleToggleComplete = async (task: Task) => {
    try {
      const result = await dispatch(
        updateTask({
          ...task,
          status: task.status === "completed" ? "pending" : "completed",
        })
      );

      if (updateTask.fulfilled.match(result)) {
        showToast.success("Task updated successfully");
      } else {
        showToast.error(result.error?.message || "Failed to update task");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast.error(error.message);
      } else {
        showToast.error("An unexpected error occurred");
      }
    }
  };

  const handleDelete = async (taskId: number) => {
    try {
      const result = await dispatch(deleteTask(taskId));

      if (deleteTask.fulfilled.match(result)) {
        showToast.success("Task deleted successfully");
      } else {
        showToast.error(result.error?.message || "Failed to delete task");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast.error(error.message);
      } else {
        showToast.error("An unexpected error occurred");
      }
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  const handleEditSubmit = async (values: {
    title: string;
    description: string;
    completed: boolean;
    due_date: string;
    status: string;
  }) => {
    if (editingTask) {
      try {
        const result = await dispatch(
          updateTask({ id: editingTask.id, ...values })
        );

        if (updateTask.fulfilled.match(result)) {
          showToast.success("Task updated successfully");
          setEditingTask(null);
        } else {
          showToast.error(result.error?.message || "Failed to update task");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          showToast.error(error.message);
        } else {
          showToast.error("An unexpected error occurred");
        }
      }
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchTasks(page));
  };

  const handleViewMore = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center text-black">
        <Loader className="w-6 h-6 mr-1 text-indigo-600 animate-spin" /> Loading
        tasks...
      </div>
    );

  return (
    <div>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.length > 0 &&
          tasks.map((task) => (
            <li
              key={task.id}
              className="flex flex-col justify-between col-span-1 bg-white divide-y divide-gray-200 rounded-lg shadow min-h-[250px]"
            >
              {editingTask && editingTask.id === task.id ? (
                <Formik
                  initialValues={{
                    title: task.title,
                    description: task.description,
                    completed: task.completed,
                    status: formatStatus(task.status),
                    due_date: formatDateForInput(task.due_date),
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleEditSubmit}
                >
                  {({ isSubmitting, dirty }) => (
                    <Form className="p-4">
                      <div className="mb-4">
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Title
                        </label>
                        <Field
                          id="title"
                          name="title"
                          type="text"
                          className="block w-full px-3 py-2 mt-1 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <ErrorMessage
                          name="title"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Description
                        </label>
                        <Field
                          as="textarea"
                          id="description"
                          name="description"
                          rows={3}
                          className="block w-full px-3 py-2 mt-1 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="due_date"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Due Date
                        </label>
                        <Field
                          id="due_date"
                          name="due_date"
                          type="datetime-local"
                          className="block w-full px-3 py-2 mt-1 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />

                        <ErrorMessage
                          name="due_date"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="status"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Status
                        </label>
                        <Field
                          as="select"
                          id="status"
                          name="status"
                          className="block w-full px-3 py-2 mt-1 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </Field>
                        <ErrorMessage
                          name="status"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>

                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setEditingTask(null)}
                          className="px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting || !dirty}
                          className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                        >
                          Save
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              ) : (
                <>
                  <div className="flex items-center justify-between w-full p-6 space-x-6">
                    <div className="flex-1 break-words truncate whitespace-normal">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {task.title}
                        </h3>
                        <span
                          className={`flex-shrink-0 inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                            task.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : task.status === "In Progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-gray-500">
                        {task.description.length <= 200
                          ? task.description
                          : `${task.description.slice(0, 200)}...`}
                      </p>
                      {task.description.length > 100 && (
                        <button
                          onClick={() => handleViewMore(task)}
                          className="mt-2 text-sm font-medium text-indigo-600 hover:underline"
                        >
                          View More
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="">
                    <div className="flex -mt-px divide-x divide-gray-200 max-h-[3rem]">
                      <div className="flex flex-1 w-0">
                        <button
                          onClick={() =>
                            handleToggleComplete({
                              ...task,
                              status: task.status
                                .replace(/\s+/g, "_")
                                .toLowerCase(),
                            })
                          }
                          className="relative inline-flex items-center justify-center flex-1 w-0 py-4 text-sm font-medium text-white bg-green-600 border border-transparent rounded-bl-lg hover:bg-green-700"
                        >
                          {formatStatus(task.status) === "completed"
                            ? "Mark as Pending"
                            : "Mark as Completed"}
                        </button>
                      </div>
                      <div className="flex flex-1 w-0 -ml-px">
                        <button
                          onClick={() => handleEdit(task)}
                          className="relative inline-flex items-center justify-center flex-1 w-0 py-4 text-sm font-medium text-white bg-indigo-600 border border-transparent hover:bg-indigo-700"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="flex flex-1 w-0 -ml-px">
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="relative inline-flex items-center justify-center flex-1 w-0 py-4 text-sm font-medium text-white bg-red-600 border border-transparent rounded-br-lg hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </li>
          ))}
      </ul>
      <div className="flex justify-center mt-12">
        <nav
          className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          {reduxTasks.length ? (
            Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  currentPage === page
                    ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))
          ) : (
            <div className="text-black">No task found!</div>
          )}
        </nav>
      </div>
      {selectedTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center break-words whitespace-normal bg-gray-900 bg-opacity-50"
          onClick={handleCloseModal}
        >
          <div
            className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg md:mx-[1rem] overflow-y-auto h-[80%] my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-gray-600">
              <span className="text-[1rem] mr-1 font-semibold text-gray-800 text-">
                Title:
              </span>
              {selectedTask.title}
            </h2>
            <p className="mt-2 text-gray-600">
              <span className="text-[1rem] mr-1 font-semibold text-gray-800">
                Status:
              </span>
              {selectedTask.status}
            </p>
            <p className="mt-2 text-gray-600">
              <span className="text-[1rem] mr-1 font-semibold text-gray-800">
                Description:
              </span>
              {selectedTask.description}
            </p>
            <p className="mt-2 text-gray-600">
              <span className="text-[1rem] mr-1 font-semibold text-gray-800">
                Due date:
              </span>
              {formatReadableDate(selectedTask.due_date)}
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

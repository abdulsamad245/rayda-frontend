"use client";

import { useDispatch } from "react-redux";
import { createTask } from "../../../lib/features/tasksSlice";
import type { AppDispatch } from "../../../lib/store";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { showToast } from "../../../lib/toast";
import { useRef } from "react";

const initialValues = {
  title: "",
  description: "",
  due_date: "",
};

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Task name is required"),
  description: Yup.string().required("Task description is required"),
  due_date: Yup.string().required("Due date is required"),
});

const handleSubmit =
  (dispatch: AppDispatch) =>
  async (
    values: typeof initialValues,
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
  ) => {
    try {
      const result = await dispatch(createTask(values));

      if (createTask.fulfilled.match(result)) {
        showToast.success("Task added successfully");
        resetForm();
      } else {
        showToast.error(result.error?.message || "Failed to add task");
      }
    } catch (error) {
      if (error instanceof Error) {
        showToast.error(error.message);
      } else {
        showToast.error("An unexpected error occurred");
      }
    }
    setSubmitting(false);
  };

export default function AddTaskForm() {
  const dispatch = useDispatch<AppDispatch>();

  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleDateClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit(dispatch)}
    >
      {({ isSubmitting }) => (
        <Form className="mb-8">
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <Field
              type="text"
              id="title"
              name="title"
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
              className="block w-full px-3 py-2 mt-1 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={3}
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
              innerRef={dateInputRef}
              type="datetime-local"
              id="due_date"
              name="due_date"
              className="block w-full px-3 py-2 mt-1 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onClick={handleDateClick}
            />
            <ErrorMessage
              name="due_date"
              component="div"
              className="mt-1 text-sm text-red-600"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex justify-center w-full px-4 py-2 mt-10 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isSubmitting ? "Adding..." : "Add Task"}
          </button>
        </Form>
      )}
    </Formik>
  );
}

import TaskList from "./components/TaskList";
import AddTaskForm from "./components/AddTaskForm";
import { cookies } from "next/headers";

export default async function Tasks() {
  const cookieStore = cookies()
  const token = (await cookieStore).get("token")?.value

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-3xl font-bold text-center text-gray-900">Please Sign in to view your tasks!</h2>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-[80%] p-4 mx-auto flex flex-col justify-center min-h-screen py-12 bg-white sm:px-6 lg:px-8 mt-[5rem]">
      <h1 className="mb-8 text-3xl font-bold text-center text-black">
        Task Management
      </h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2 lg:col-span-3">
          <AddTaskForm />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
           <TaskList />
        </div>
      </div>
    </div>
  );
}

import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="mb-20 text-4xl font-bold text-center text-black">Welcome to Task Management App</h1>
      <div className="space-x-4">
        <Link href="/signin" className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600">
          Signin
        </Link>
        <Link href="/signup" className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-600">
          Signup
        </Link>
      </div>
    </div>
  )
}


# Task Management App

This is a Next.js application for managing tasks, built with Redux Toolkit and TypeScript.

## Prerequisites

- Node.js (version 14 or later)
- npm or yarn

## Setup

1. Clone the repository:

   ```sh
   git clone https://github.com/abdulsamad245/rayda-frontend.git
   cd rayda-frontend
   ```

2. Install dependencies:

   ```sh
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:

   Create a `.env.local` file in the root directory of the project and add the following:

   ```env
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
   ```

4. Run the development server:

   ```sh
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building for Production

To create a production build, run:

```sh
npm run build
# or
yarn build
```

Then, you can start the production server with:

```sh
npm start
# or
yarn start
```

## Docker

To run the application using Docker:

1. Build the Docker image:

   ```sh
   docker build -t rayda-frontend .
   ```

2. Run the container:

   ```sh
   docker run -p 3000:3000 rayda-frontend
   ```


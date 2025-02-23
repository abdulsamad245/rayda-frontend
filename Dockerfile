# Task Management App

This is a Next.js application for managing tasks, built with Redux Toolkit and TypeScript.

## Prerequisites

- Node.js (version 14 or later)
- npm or yarn

## Setup

1. Clone the repository:

   \`\`\`
   git clone https://github.com/yourusername/task-management-app.git
   cd task-management-app
   \`\`\`

2. Install dependencies:

   \`\`\`
   npm install
   # or
   yarn install
   \`\`\`

3. Set up environment variables:

   Create a \`.env.local\` file in the root directory of the project and add the following:

   \`\`\`
   NEXT_PUBLIC_API_URL=http://your-api-url.com
   \`\`\`

   Replace \`http://your-api-url.com\` with the actual URL of your backend API.

4. Run the development server:

   \`\`\`
   npm run dev
   # or
   yarn dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building for Production

To create a production build, run:

\`\`\`
npm run build
# or
yarn build
\`\`\`

Then, you can start the production server with:

\`\`\`
npm start
# or
yarn start
\`\`\`

## Docker

To run the application using Docker:

1. Build the Docker image:

   \`\`\`
   docker build -t task-management-app .
   \`\`\`

2. Run the container:

   \`\`\`
   docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://your-api-url.com task-management-app
   \`\`\`

   Replace \`http://your-api-url.com\` with your actual API URL.

## Testing

To run tests:

\`\`\`
npm test
# or
yarn test
\`\`\`

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.


# SyncOps Project

This project is developed for the Perplexity Hackathon using the Perplexity Sonar API. It is a frontend-focused React application designed to provide a rich set of AI-powered features and tools without requiring a separate backend server.

## Project Overview

SyncOps is a comprehensive platform that integrates various AI functionalities, including content generation, summarization, translation, analytics, chat, and more. The project leverages the Perplexity Sonar API to enhance AI capabilities and deliver an interactive user experience.

## Key Highlights

- Frontend-only architecture: The entire application runs in the browser without needing a separate backend server
- Direct API integration: Communicates directly with Perplexity Sonar API and other services from the client side
- Firebase authentication: Handles all user authentication and management purely through Firebase client SDK
- Reduced complexity: Simplified deployment with only frontend infrastructure needed

## Project Structure

**Frontend/**: React application built with Vite, featuring:

- AI-powered tools and features
- Firebase authentication integration
- Multi-page navigation
- Responsive UI components

## Features

- AI-powered content generation, rewriting, summarization, and translation
- Chat interface with AI capabilities
- Analytics and data insights dashboards
- User profile and settings management
- Multi-language support with i18next
- Firebase authentication and data storage
- Responsive and accessible UI using Chakra UI and Material UI components

## Technologies Used

### Frontend

- React 18
- Vite
- Chakra UI
- Material UI
- Firebase (Authentication)
- i18next (internationalization)
- React Router DOM
- Framer Motion
- Perplexity Sonar API integration
- ESLint for linting

## Installation and Setup

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn
- Firebase project configuration

### Setup

Navigate to the project directory:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file with your Firebase configuration and API keys:

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_PERPLEXITY_API_KEY=your_perplexity_key
```

Start the development server:

```bash
npm run dev
```

## Usage

- Access the application via the URL provided by the Vite development server (usually http://localhost:5173)
- All AI features work directly from the frontend
- Authentication is handled through Firebase UI
- Explore various AI-powered tools through the intuitive interface

## Deployment

The frontend-only architecture allows for easy deployment to:

- Vercel
- Netlify
- Firebase Hosting
- Any static site hosting service

## Contribution

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the ISC License.

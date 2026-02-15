# Hintro-FE

Hintro-FE is a modern task management application built with React, Vite, and Tailwind CSS. It features a Kanban-style task board with drag-and-drop capabilities, user authentication, and persistent state management.

## Features

- **User Authentication**: Secure login and session persistence using `AuthContext`.
- **Kanban Task Board**: Visualize tasks in columns (e.g., To Do, In Progress, Done).
- **Drag-and-Drop Interface**: Seamlessly move tasks between columns using `@hello-pangea/dnd`.
- **Task Management**: Create, edit, delete, filter, and sort tasks.
- **Activity Log**: Track changes and updates to tasks.
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS.
- **Form Handling**: Efficient form validation using `react-hook-form`.

## Tech Stack

- **Frontend Framework**: React (v18+) with Vite for fast build and development.
- **Styling**: Tailwind CSS for utility-first styling.
- **State Management**: React Context API (`AuthContext`, `BoardContext`).
- **Routing**: React Router DOM (v6+).
- **Drag and Drop**: `@hello-pangea/dnd`.
- **Icons**: Lucide React.
- **Date Handling**: date-fns.
- **Utility Libraries**: clsx, tailwind-merge.

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd Hintro_fe
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Application

1.  **Start the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

2.  Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

### building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
# or
yarn preview
```

## Project Structure

```
src/
├── assets/          # Static assets (images, fonts, etc.)
├── components/      # Reusable React components
├── context/         # React Context providers (Auth, Board)
├── hooks/           # Custom React hooks
├── pages/           # Application pages (LoginPage, BoardPage)
├── types/           # Type definitions (if applicable)
├── utils/           # Utility functions and helpers
├── App.jsx          # Main application component
├── main.jsx         # Entry point
└── index.css        # Global styles and Tailwind imports
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

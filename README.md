# Todo App Frontend

A modern, beautiful frontend for the Todo App backend with full CRUD functionality.

## Features

- ✨ **Modern glassmorphism design** with smooth animations
- 📊 **Real-time statistics** showing total, pending, and completed todos
- 🎯 **Filter todos** by all, pending, or completed
- ✏️ **Edit todos** with modal interface
- ✅ **Toggle completion** status with checkboxes
- 🗑️ **Delete todos** with confirmation
- 📱 **Fully responsive** design
- 🎨 **Beautiful gradients** and micro-interactions

## Prerequisites

- The backend server must be running on `http://localhost:5000`
- A modern web browser

## Running the Application

### Option 1: Simple HTTP Server (Recommended)

Using Python 3:
```bash
python3 -m http.server 8080
```

Using Node.js (if you have `http-server` installed):
```bash
npx http-server -p 8080
```

Then open your browser to: `http://localhost:8080`

### Option 2: Direct File Access

Simply open the `index.html` file in your browser. Note that some browsers may have CORS restrictions when opening files directly.

### Option 3: Live Server (VS Code)

If you're using VS Code, install the "Live Server" extension and right-click on `index.html` > "Open with Live Server"

## Backend Connection

The frontend connects to the backend API at:
```
http://localhost:5000/api/todos
```

**Important**: Make sure your backend server is running before using the frontend!

Start the backend:
```bash
cd ../todo-app-backend
npm run dev
```

## Project Structure

```
todo-app-frontend/
├── index.html      # Main HTML structure
├── styles.css      # Modern CSS with glassmorphism
├── app.js          # JavaScript with API integration
└── README.md       # This file
```

## API Integration

The frontend integrates with all backend endpoints:

| Action | HTTP Method | Endpoint |
|--------|-------------|----------|
| Fetch all todos | GET | `/api/todos` |
| Create todo | POST | `/api/todos` |
| Update todo | PUT | `/api/todos/:id` |
| Delete todo | DELETE | `/api/todos/:id` |

## Features Breakdown

### Create Todo
- Fill in the title (required) and description (optional)
- Click "Add Todo" button
- Todo appears at the top of the list

### View Todos
- All todos are displayed with their title, description, and creation time
- Use filter tabs to view All, Pending, or Completed todos
- Statistics update automatically

### Edit Todo
- Click the "✏️ Edit" button on any todo
- Modal opens with current values
- Update and save changes

### Complete Todo
- Click the checkbox to mark as complete
- Completed todos are visually distinguished with strikethrough

### Delete Todo
- Click the "🗑️ Delete" button
- Confirm deletion in the dialog

## Design System

The app uses a modern design system with:
- **Color Scheme**: Dark theme with purple/blue gradients
- **Typography**: Inter font family
- **Effects**: Glassmorphism, subtle animations, hover effects
- **Layout**: Responsive grid and flexbox

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with glassmorphism
- **Vanilla JavaScript** - No frameworks, pure JS
- **Fetch API** - HTTP requests to backend
- **Google Fonts** - Inter font family

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Troubleshooting

### "Failed to load todos" error
- Ensure the backend server is running on port 5000
- Check the browser console for CORS errors
- Verify the backend is accessible at `http://localhost:5000/api/todos`

### UI not updating
- Check browser console for JavaScript errors
- Refresh the page
- Clear browser cache

## License

ISC

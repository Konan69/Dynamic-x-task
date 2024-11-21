# Project Overview

## Frontend Design Decisions 🎨

### UI/UX
- Adopted SportX's green and black color scheme for brand consistency
- Utilized shadcn UI components for a clean, modern interface
- Implemented full mobile responsiveness
- Added toast notifications for better user feedback

### Features
- Built a Kanban board with drag-and-drop functionality (inspired by Trello/Jira)
- Implemented drag-and-drop mostly manually because it seemed fun! 😄
- Added support for mobile touch events
- Implemented optimistic updates for smooth UX with appropriate fallbacks

### Technical Stack
- **State Management**: Zustand (with localStorage persistence)
- **Data Fetching**: TanStack Query + Axios
- **Routing**: React Router with protected routes
- **Auth**: JWT tokens managed with js-cookie
- **Testing**: Vitest + React Testing Library

### Future Improvements 🚀
- Expand test coverage
- Add Framer Motion animations
- Implement loading skeletons for data fetching states

## Backend Design Decisions 🛠️

### Architecture
- Custom error handling with extended Error class
- Protected endpoints with custom middleware
- Request validation for body and params
- Environment-based logic handling (development/production)

### Testing
- Jest for unit testing
- Supertest for API testing

### Future Improvements 🎯
- Add Swagger/OpenAPI documentation

## Getting Started 🚀

### Client Setup
```bash
cd client 
npm install
npm run dev
```

### Server Setup
```bash
cd server 
yarn install
npm run dev
```


or docker 
(still in progress)
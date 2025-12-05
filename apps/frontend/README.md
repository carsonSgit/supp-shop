# Supplement Shop Frontend

React frontend application for the Supplement Shop, migrated to TanStack Router and organized with feature-based architecture.

## Project Structure

```
apps/frontend/
├── src/
│   ├── app/              # TanStack Router configuration
│   │   ├── router.tsx    # Router setup and route definitions
│   │   └── routes/       # Route definitions (if using file-based routing)
│   ├── api/              # API client layer
│   │   ├── client.ts     # Base API client with error handling
│   │   ├── endpoints.ts  # API endpoint definitions
│   │   ├── types.ts      # API response types
│   │   ├── auth.ts       # Authentication API
│   │   ├── users.ts      # Users API
│   │   ├── products.ts   # Products API
│   │   └── orders.ts     # Orders API
│   ├── features/         # Feature-based organization
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── api/
│   │   ├── users/
│   │   │   ├── components/
│   │   │   ├── hooks/    # useUsers.ts - TanStack Query hooks
│   │   │   └── api/
│   │   ├── products/
│   │   │   ├── components/
│   │   │   ├── hooks/    # useProducts.ts - TanStack Query hooks
│   │   │   └── api/
│   │   └── orders/
│   │       ├── components/
│   │       ├── hooks/    # useOrders.ts - TanStack Query hooks
│   │       └── api/
│   ├── shared/           # Shared components, hooks, utils
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── types/
│   ├── config/           # Configuration files
│   │   └── api.ts        # API base URL configuration
│   ├── layouts/          # Layout components
│   ├── pages/            # Page components
│   └── components/      # Legacy components (to be migrated)
├── public/
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm, pnpm, or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

2. Create environment file:
   ```bash
   cp .env.example .env.development
   ```

3. Update `.env.development` with your API URL:
   ```
   VITE_API_URL=http://localhost:1339
   ```

4. Start development server:
   ```bash
   npm start
   ```

## API Client Usage

### Basic Usage

```javascript
import { usersApi } from '../api/users';

// Get all users
const users = await usersApi.getAll();

// Create user
const newUser = await usersApi.create({ username, email, password });

// Update user
const updated = await usersApi.update(username, { email: newEmail });

// Delete user
await usersApi.delete(username);
```

### Using TanStack Query Hooks

```javascript
import { useUsers, useCreateUser } from '../features/users/hooks/useUsers';

function UserList() {
  const { data: users, isLoading, error } = useUsers();
  const createUser = useCreateUser();

  const handleCreate = async () => {
    try {
      await createUser.mutateAsync({ username, email, password });
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {users.map(user => <div key={user.username}>{user.username}</div>)}
    </div>
  );
}
```

## Routing

### TanStack Router

The application uses TanStack Router for type-safe routing. Routes are defined in `src/app/router.tsx`.

### Navigation

```javascript
import { useNavigate } from '@tanstack/react-router';

function MyComponent() {
  const navigate = useNavigate();

  // Navigate to a route
  navigate({ to: '/users' });

  // Navigate with search params
  navigate({ 
    to: '/', 
    search: { errorMessage: 'Something went wrong' } 
  });
}
```

### Links

```javascript
import { Link } from '@tanstack/react-router';

<Link to="/users">Users</Link>
```

## Environment Variables

- `VITE_API_URL` - API base URL (default: `http://localhost:1339`)

For Create React App compatibility, also supports:
- `REACT_APP_API_URL` - Alternative API URL variable

## Migration Status

See `MIGRATION_GUIDE.md` for detailed migration progress and remaining tasks.

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (irreversible)

## Technologies

- React 18
- TanStack Router - Type-safe routing
- TanStack Query - Data fetching and caching
- React Bootstrap - UI components
- React Cookie - Cookie management

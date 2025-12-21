# Bookify Admin Dashboard - Team Guide

Welcome to the Bookify Admin Dashboard project! This guide will help you understand the project structure and how to continue development.

## Project Structure

```
dashboard/
├── app/
│   ├── (admin)/              # Admin routes group
│   │   ├── dashboard/        # Dashboard overview
│   │   ├── users/            # User management
│   │   ├── hotels/           # Hotel management
│   │   │   └── rooms/        # Room inventory
│   │   ├── bookings/         # Booking management
│   │   ├── financials/       # Financial reports
│   │   ├── content/          # Content management
│   │   │   ├── destinations/ # Destinations
│   │   │   ├── categories/   # Categories
│   │   │   └── reviews/      # Reviews moderation
│   │   ├── settings/         # Settings
│   │   └── layout.tsx        # Admin layout wrapper
│   ├── globals.css           # Global styles and theme
│   └── layout.tsx            # Root layout with providers
├── components/
│   ├── common/               # Shared components
│   │   └── ThemeToggleButton.tsx
│   └── header/               # Header components
│       ├── NotificationDropdown.tsx
│       └── UserDropdown.tsx
├── context/                  # React contexts
│   ├── SidebarContext.tsx    # Sidebar state management
│   └── ThemeContext.tsx      # Theme state management
├── icons/                    # Icon components
│   └── index.tsx
├── layout/                   # Layout components
│   ├── AppHeader.tsx         # Main header
│   ├── AppSidebar.tsx        # Sidebar navigation
│   ├── Backdrop.tsx          # Mobile overlay
│   └── SidebarWidget.tsx     # Sidebar widget
└── services/
    └── api/                  # API service layer
        ├── client.ts         # Axios client configuration
        ├── users.api.ts      # User API endpoints
        ├── hotels.api.ts     # Hotel API endpoints
        ├── bookings.api.ts   # Booking API endpoints
        ├── financials.api.ts # Financial API endpoints
        ├── content.api.ts    # Content API endpoints
        └── index.ts          # Export all services
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard) to view the admin dashboard.

## Adding New Pages

### Step 1: Create the Page File

Create a new file in the appropriate directory under `app/(admin)/`:

```tsx
// app/(admin)/new-page/page.tsx
import React from "react";

export default function NewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Page Title
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Page description
        </p>
      </div>
      {/* Your content here */}
    </div>
  );
}
```

### Step 2: Add Navigation Link

Update `layout/AppSidebar.tsx` to add the new page to the navigation:

```tsx
const navItems: NavItem[] = [
  // ... existing items
  {
    icon: <YourIcon />,
    name: "New Page",
    path: "/new-page",
  },
];
```

## Using API Services

### Import the Service

```tsx
import { usersApi } from "@/services/api";
```

### Make API Calls

```tsx
// In a React component
const fetchUsers = async () => {
  try {
    const data = await usersApi.getAllUsers({ page: 1, limit: 10 });
    console.log(data);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};
```

### Example with React State

```tsx
"use client";
import { useState, useEffect } from "react";
import { usersApi, User } from "@/services/api";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await usersApi.getAllUsers();
        setUsers(data.users);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {users.map((user) => (
        <div key={user._id}>{user.username}</div>
      ))}
    </div>
  );
}
```

## Theme Customization

### Colors

All colors are defined in `app/globals.css` using CSS custom properties. To change colors:

```css
@theme {
  --color-brand-500: #465fff; /* Change this to your brand color */
  --color-brand-600: #3641f5;
  /* ... other shades */
}
```

### Dark Mode

The theme automatically supports dark mode. Use Tailwind's `dark:` prefix for dark mode styles:

```tsx
<div className="bg-white dark:bg-gray-900">
  <p className="text-gray-800 dark:text-white/90">Text</p>
</div>
```

### Custom Utilities

The project includes custom utilities for menu items:

- `menu-item` - Base menu item styles
- `menu-item-active` - Active state
- `menu-item-inactive` - Inactive state
- `menu-dropdown-item` - Dropdown menu item
- `custom-scrollbar` - Custom scrollbar styles

## Component Patterns

### Page Header

```tsx
<div className="flex items-center justify-between">
  <div>
    <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
      Page Title
    </h1>
    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Description</p>
  </div>
  <button className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600">
    Action Button
  </button>
</div>
```

### Data Table

```tsx
<div className="overflow-hidden bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
            Column
          </th>
        </tr>
      </thead>
      <tbody>{/* Table rows */}</tbody>
    </table>
  </div>
</div>
```

### Status Badge

```tsx
<span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-success-50 text-success-600 dark:bg-success-500/20 dark:text-success-400">
  Active
</span>
```

## Next Steps

1. **Connect to Backend**: Update the `NEXT_PUBLIC_API_BASE_URL` in `.env.local` to point to your backend API
2. **Implement Data Fetching**: Replace placeholder content in pages with actual API calls
3. **Add Charts**: Install and configure chart libraries (ApexCharts or Recharts) for dashboard visualizations
4. **Implement Authentication**: Add login/logout functionality and protect admin routes
5. **Add Form Validation**: Use libraries like React Hook Form + Zod for form handling
6. **Implement Table Features**: Add pagination, sorting, and filtering to data tables

## Useful Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Need Help?

- Check the TODO comments in the code for implementation hints
- Review the existing page templates for patterns
- Refer to the API service files for endpoint structure
- Use the theme utilities defined in `globals.css`

Happy coding! 🚀

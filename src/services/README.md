# API Service Documentation

This directory contains reusable API services and utilities for making HTTP requests throughout the application.

## Files

- `apiService.js` - Main API service with axios configuration and reusable functions
- `../hooks/useCompsData.js` - Custom React hook for fetching and managing comps data

## Usage

### Basic API Service

```javascript
import { get, post, put, del, fetchCompsData } from "../services/apiService";

// Generic GET request
const response = await get("https://api.example.com/data");

// Generic POST request
const response = await post("https://api.example.com/data", { key: "value" });

// Fetch comps data specifically
const compsResult = await fetchCompsData();
if (compsResult.success) {
  console.log(compsResult.data);
}
```

### Using the Custom Hook

```javascript
import { useCompsData } from "../hooks/useCompsData";

function MyComponent() {
  const { metaDecks, champions, items, isLoading, error, refetch } =
    useCompsData();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <button onClick={refetch}>Refresh Data</button>
      {/* Render your data */}
    </div>
  );
}
```

### Hook Options

```javascript
const { metaDecks, isLoading, error } = useCompsData({
  immediate: false, // Don't fetch on mount
  retryAttempts: 5, // Try 5 times on failure
  retryDelay: 2000, // 2 second delay between retries
});
```

## Features

- **Error Handling**: Comprehensive error handling with retry logic
- **Loading States**: Built-in loading state management
- **Caching**: Response interceptors for potential caching implementation
- **Retries**: Exponential backoff retry mechanism
- **TypeScript Ready**: Easy to add TypeScript definitions
- **Reusable**: Generic functions for all HTTP methods

## Error Handling

The API service provides structured error responses:

```javascript
{
  success: false,
  error: "Error message",
  status: 404 // HTTP status code if available
}
```

## Adding New API Endpoints

To add new API endpoints, extend the `apiService.js`:

```javascript
export const fetchUserData = async (userId) => {
  const config = {
    method: "GET",
    url: `https://api.example.com/users/${userId}`,
  };

  return await apiCall(config);
};
```

## Environment Configuration

You can configure different base URLs for different environments by modifying the axios instance in `apiService.js`:

```javascript
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://api.example.com",
  timeout: 10000,
});
```

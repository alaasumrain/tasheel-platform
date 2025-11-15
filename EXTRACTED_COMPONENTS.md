# Extracted Components from Cloned Repositories

This document lists all components, hooks, and utilities extracted from the cloned repositories and adapted for the Tasheel platform.

---

## 🎣 React Query Hooks for Supabase

### 1. `use-supabase-query.ts`
**Location**: `src/hooks/use-supabase-query.ts`  
**Source**: `temp/next-supabase-starter/hooks/use-client-fetch.ts`

**What it does**:
- Fetches data from Supabase tables using React Query
- Provides automatic caching and refetching
- Supports custom filters and query builders

**Usage**:
```tsx
import { useSupabaseQuery } from '@/hooks/use-supabase-query';

// Basic usage
const { data, isLoading, error } = useSupabaseQuery(
  'orders',
  'orders-list'
);

// With filters
const { data } = useSupabaseQuery(
  'orders',
  'user-orders',
  {
    filters: (query) => 
      query.eq('user_id', userId).order('created_at', { ascending: false }),
    cacheTime: 60000 // Cache for 1 minute
  }
);

// Fetch single record by ID
const { data } = useSupabaseQueryById(
  'orders',
  'order-123',
  orderId
);
```

**Benefits**:
- ✅ Automatic caching
- ✅ Loading and error states
- ✅ TypeScript support
- ✅ Easy to invalidate queries

---

### 2. `use-supabase-mutation.ts`
**Location**: `src/hooks/use-supabase-mutation.ts`  
**Source**: `temp/next-supabase-starter/hooks/use-client-mutation.ts`

**What it does**:
- Handles insert, update, and delete operations
- Automatic query invalidation
- Optimistic updates for better UX

**Usage**:
```tsx
import { useSupabaseMutation } from '@/hooks/use-supabase-mutation';

// Insert
const insertMutation = useSupabaseMutation('orders', 'insert', {
  invalidateQueries: ['orders-list']
});

insertMutation.mutate({
  user_id: userId,
  service_id: serviceId,
  status: 'pending'
});

// Update
const updateMutation = useSupabaseMutation('orders', 'update', {
  invalidateQueries: ['orders-list', 'user-orders']
});

updateMutation.mutate({
  id: orderId,
  status: 'completed'
});

// Delete
const deleteMutation = useSupabaseMutation('orders', 'delete');
deleteMutation.mutate({ id: orderId });
```

**Benefits**:
- ✅ Automatic cache invalidation
- ✅ Optimistic updates
- ✅ Error handling with rollback
- ✅ TypeScript support

---

### 3. `use-auth-query.ts`
**Location**: `src/hooks/use-auth-query.ts`  
**Source**: `temp/next-supabase-starter/lib/auth-context.tsx`

**What it does**:
- Gets current authenticated user with React Query
- Automatic refetching on window focus
- Simple authentication check

**Usage**:
```tsx
import { useAuthQuery, useIsAuthenticated } from '@/hooks/use-auth-query';

// Get user
const { user, isLoading, error } = useAuthQuery();

// Check if authenticated
const { isAuthenticated, isLoading } = useIsAuthenticated();
```

**Benefits**:
- ✅ Automatic user state management
- ✅ Refetches on focus
- ✅ TypeScript support
- ✅ Works with React Query cache

---

## 🎨 UI Components

### 4. `password-input.tsx`
**Location**: `src/components/ui/password-input.tsx`  
**Source**: `temp/next-supabase-starter/components/ui/password-input.tsx` + `temp/react-admin` patterns

**What it does**:
- Password input field with show/hide toggle
- Uses MUI components (OutlinedInput)
- Uses Tabler icons (IconEye, IconEyeOff)

**Usage**:
```tsx
import PasswordInput from '@/components/ui/password-input';

<FormControl required>
  <FormLabel>Password</FormLabel>
  <PasswordInput
    name="password"
    required
    fullWidth
    initiallyVisible={false}
  />
</FormControl>
```

**Benefits**:
- ✅ Consistent with your MUI theme
- ✅ Accessible (ARIA labels)
- ✅ Uses your existing icon library
- ✅ TypeScript support

---

## 📋 Integration Checklist

When using these extracted components:

- [x] ✅ All hooks use your existing Supabase client setup
- [x] ✅ All components use MUI (not Tailwind/Radix)
- [x] ✅ TypeScript types are properly defined
- [ ] ⚠️ Add i18n support where needed (some components may need translation keys)
- [ ] ⚠️ Test with your existing authentication flow
- [ ] ⚠️ Update any hardcoded strings to use next-intl

---

## 🔄 Migration Guide

### Replacing Manual Supabase Queries

**Before**:
```tsx
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  supabase.from('orders').select('*')
    .then(({ data, error }) => {
      if (error) throw error;
      setData(data);
      setLoading(false);
    });
}, []);
```

**After**:
```tsx
const { data, isLoading } = useSupabaseQuery('orders', 'orders-list');
```

### Replacing Manual Mutations

**Before**:
```tsx
const handleUpdate = async () => {
  const { error } = await supabase
    .from('orders')
    .update({ status: 'completed' })
    .eq('id', orderId);
  
  if (error) {
    // handle error
  } else {
    // refetch data manually
  }
};
```

**After**:
```tsx
const mutation = useSupabaseMutation('orders', 'update', {
  invalidateQueries: ['orders-list']
});

mutation.mutate({ id: orderId, status: 'completed' });
```

---

## 🚀 Next Steps

1. **Test the hooks** in a real component
2. **Add error handling** with toast notifications
3. **Add loading states** to your UI
4. **Consider extracting more components**:
   - Form components with validation
   - Data table components
   - Dashboard widgets

---

## 📚 Additional Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [MUI Components](https://mui.com/material-ui/getting-started/)

---

## 🎯 Components to Extract Next

Based on the cloned repos, here are components you might want to extract:

1. **Form Components** (from `nextjs-mui-hook-form-starter`)
   - Form validation patterns
   - React Hook Form + MUI integration

2. **Data Table Components** (from `materio-nextjs`)
   - Sortable tables
   - Pagination
   - Filtering

3. **Dashboard Components** (from `nextjs14-supabase-dashboard`)
   - Stats cards
   - Charts integration
   - Widget layouts

4. **Auth Components** (from `next-supabase-starter`)
   - Protected route wrapper
   - Auth state management
   - Session handling


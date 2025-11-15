# Wizard Improvements Based on Cloned Repos

## Key Findings from `nextjs-wizard-tutorial` and React Hook Form Examples

### 1. **React Hook Form Integration Pattern**

**What they do:**
- Use `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage` components
- `FormMessage` automatically displays errors from `getFieldState`
- Use `mode: "onChange"` for real-time validation
- Use `getFieldState(fieldName, formState)` to check field state
- Visual indicators (icons) for validation states (loading, error, success)

**Example from `site-form.tsx`:**
```tsx
const form = useForm({
  resolver: zodResolver(FormSchema),
  mode: "onChange" // Real-time validation
});

const urlIsDirty = getFieldState("url", formState).isDirty;
const urlInvalid = getFieldState("url", formState).invalid;

<FormField 
  control={control}
  name="url"
  render={({ field }) => (
    <FormItem>
      <FormLabel>URL</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage /> {/* Automatically shows error */}
    </FormItem>
  )}
/>
```

### 2. **Error Display Pattern**

**What they do:**
- `FormMessage` component automatically shows errors
- Uses `getFieldState` to check `invalid`, `isDirty`, `error` states
- Visual feedback with icons (CheckCircle, XCircle, Loader2)
- Errors are tied to form state, not separate error state

**Our current issue:**
- We're managing errors separately with `errors` state
- Not using React Hook Form's built-in error handling
- Need to integrate `FormMessage` or similar pattern

### 3. **Validation Triggering**

**What they do:**
- Use `trigger(fieldName)` to manually trigger validation
- Use `clearErrors(fieldName)` to clear specific errors
- Debounce validation for async fields
- Use `setValue` with `shouldValidate: true/false` options

**Example:**
```tsx
// Trigger validation after debounce
useEffect(() => {
  urlValue ? trigger("url") : clearErrors("url");
  setIsTyping(false);
}, [urlValue])
```

### 4. **Button State Management**

**What they do:**
- Use `formState.isValid` to disable submit button
- Use `formState.isSubmitting` for loading state
- Check specific field states with `getFieldState`

**Example:**
```tsx
<Button 
  disabled={!formState.isValid || formState.isSubmitting}
>
  Submit
</Button>
```

## Recommended Improvements for Our Wizard

### 1. **Integrate React Hook Form Properly**
- Use `FormField` components for all inputs
- Use `FormMessage` for automatic error display
- Use `getFieldState` instead of manual error tracking

### 2. **Fix Validation Display**
- Ensure errors show immediately when clicking "Next"
- Use `formState.errors` to get all errors
- Display missing fields in toast AND in form

### 3. **Improve Button Logic**
- Use `formState.isValid` for step validation
- Check all required fields for current step
- Show clear feedback when fields are missing

### 4. **Visual Feedback**
- Add icons for validation states (like the tutorial)
- Show loading state during validation
- Clear visual distinction between valid/invalid fields

## Next Steps

1. Refactor wizard to use React Hook Form's `FormField` pattern
2. Replace manual error state with `formState.errors`
3. Use `FormMessage` component for automatic error display
4. Add visual indicators (icons) for field validation states
5. Improve button disabled logic using `formState.isValid`


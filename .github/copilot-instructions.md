# WinMorphus - AI Agent Instructions

## Project Overview

WinMorphus is a React-based investment/trading platform built with Vite, featuring multi-level marketing (MLM) capabilities, ROI tracking, commission management, and cryptocurrency withdrawals. The app uses React Router v7 for navigation and Tailwind CSS v4 for styling.

## Architecture & Key Patterns

### Authentication Flow

- **Context-based auth**: `AuthContext` stores user/token in localStorage and React state
- **Protected routes**: `ProtectedRoute` checks `localStorage.getItem("token")` before rendering
- **Token usage**: All API calls include `Authorization: Bearer ${token}` header
- **Login methods**: Standard username/password + force login via URL params (`?token=...&force_login=true`)

### API Communication

- **Centralized service**: All API calls go through `apiRequest()` in `src/Services/Api.js`
- **Base URL**: Defined in `src/Api/Api_variables.js` - single source of truth for all endpoints
- **Error handling**: Axios errors are caught, logged with `console.error`, and thrown to caller
- **Response structure**: APIs return `{ data: {...}, message?: string }`

### Component Organization

```
src/
├── Pages/           # Full page components (Dashboard, Packages, etc.)
├── Component/       # Shared components (MainNavbar, ui/)
├── Layout/          # Layout wrappers (MainLayout with Outlet)
├── Context/         # React contexts (AuthContext)
├── Services/        # API service layer
├── Api/             # API endpoint constants
└── routes/          # Router configuration
```

### Routing Structure

- **Router**: `createBrowserRouter` in `src/routes/router.jsx`
- **Nested routes**: All authenticated routes nest under `ProtectedRoute` → `MainLayout` → page component
- **Referral links**: `/ref/:referralId` routes to Signup page with referral context
- **Fallback**: All unmatched routes redirect to `/login`

### State Management

- **No Redux/Zustand**: Uses React Context + `useState` + `useEffect`
- **Auth state**: Managed in `AuthContext` with `login()`, `logout()`, `refreshUser()` methods
- **Theme state**: Managed in `ThemeContext` with `toggleTheme()`, `setSpecificTheme()` methods
- **Component state**: Local state with `useState` for UI, API data cached in component state
- **Notifications**: `notistack` library with `enqueueSnackbar()` for user feedback

### Form Handling

- **Library**: Formik for form state management
- **Validation**: Yup schemas for validation rules
- **Pattern**: All forms follow same structure:
  ```jsx
  const formik = useFormik({
    initialValues: {...},
    validationSchema: Yup.object({...}),
    onSubmit: async (values) => { /* API call */ }
  });
  ```
- **Error display**: Show `formik.touched.field && formik.errors.field` for inline errors
- **Disabled states**: Buttons disabled during `isLoading` or `!formik.isValid`

### Styling Conventions

- **Framework**: Tailwind CSS v4 with `@tailwindcss/vite` plugin
- **Theme system**: CSS variables for light/dark mode (see `index.css`)
- **Color scheme**:
  - Dark: slate-900 background, yellow-400 accents, gradient cards
  - Light: white background, yellow-600 accents, lighter gradients
- **CSS Variables**: Use `bg-[var(--bg-primary)]` or `text-[var(--text-primary)]` for theme-aware colors
- **Theme toggle**: `useTheme()` hook provides `theme`, `toggleTheme()`, `isDark` state
- **Gradient pattern**: `bg-linear-to-br from-{color}-900 to-slate-900 border-2 border-{color}-500`
- **Responsive**: Mobile-first with `sm:`, `md:`, `lg:` breakpoints
- **Icons**: `lucide-react` library for all icons (Sun/Moon for theme toggle)
- **No CSS modules**: Inline Tailwind classes only

### Theme System (CSS Variables)

The app supports light and dark themes via CSS variables defined in `src/index.css`:

**Available CSS Variables:**

```css
/* Backgrounds */
--bg-primary, --bg-secondary, --bg-tertiary, --bg-card
--bg-card-gradient-start, --bg-card-gradient-end

/* Text */
--text-primary, --text-secondary, --text-tertiary, --text-muted

/* Borders */
--border-primary, --border-secondary, --border-accent

/* Accents */
--accent-primary, --accent-secondary, --accent-hover

/* Status */
--status-success, --status-error, --status-warning, --status-info

/* Components */
--navbar-bg, --navbar-border, --input-bg, --input-border
--scrollbar-track, --scrollbar-thumb, --scrollbar-thumb-hover
```

**Usage Pattern:**

```jsx
import { useTheme } from "../Context/UseTheme";

const MyComponent = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <button onClick={toggleTheme}>{isDark ? <Sun /> : <Moon />}</button>
    </div>
  );
};
```

**Theme persistence**: Saved to localStorage as `theme` key, auto-applied on mount

### Data Loading Pattern

```jsx
const [loading, setLoading] = useState(false);
const [data, setData] = useState(null);

const fetchData = () => {
  setLoading(true);
  apiRequest({
    endpoint,
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => {
      setData(response.data);
      setLoading(false);
    })
    .catch((error) => {
      enqueueSnackbar(error?.message || "Error", { variant: "error" });
      setLoading(false);
    });
};

useEffect(() => {
  if (token) fetchData();
}, [token]);
```

### UI Components Library

- **Location**: `src/Component/ui/` - all exported via index.js
- **Reusable components**: `StatusBadge`, `PaginationButton`, `ShimmerLoader`, `PageHeader`
- **Content loaders**: `react-content-loader` for shimmer effects during loading states
- **Charts**: `recharts` library for data visualization (RoiChart, RankChart)

## Development Workflow

### Commands

- `npm run dev` - Start Vite dev server (default port 5173)
- `npm run build` - Production build to `dist/`
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### ESLint Configuration

- Flat config format (`eslint.config.js`)
- React Hooks plugin with recommended rules
- React Refresh plugin for Vite HMR
- Custom rule: Ignore unused vars matching `^[A-Z_]` (constants/components)

### Adding New Pages

1. Create component in `src/Pages/{Feature}/{Feature}.jsx`
2. Export from `src/Pages/index.js`
3. Add route in `src/routes/router.jsx` under `MainLayout` children
4. Add nav item to `MainNavbar.jsx` `navItems` array
5. Define API endpoints in `src/Api/Api_variables.js`

### API Integration

1. Add endpoint constant to `Api_variables.js` (e.g., `export const MY_ENDPOINT = "my-endpoint"`)
2. Import in component: `import { MY_ENDPOINT } from "../../Api/Api_variables"`
3. Use `apiRequest()` with token: `apiRequest({ endpoint: MY_ENDPOINT, method: 'POST', headers: { Authorization: \`Bearer ${token}\` } })`
4. Handle response in `.then()`, errors in `.catch()`

## Common Patterns

### Conditional Rendering for Auth

```jsx
// Public pages (Login/Signup) show auth buttons in navbar
// Authenticated pages show user profile dropdown
{
  user ? <ProfileDropdown /> : <AuthButtons />;
}
```

### Date Formatting

```jsx
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
```

### Navigation

- Use `useNavigate()` for programmatic navigation: `navigate('/dashboard')`
- Use `<Link to="/path">` for declarative navigation
- Current route detection: `location.pathname === path`

### Modal Patterns

- State: `const [isModalOpen, setIsModalOpen] = useState(false)`
- Props: `isOpen`, `onClose`, `data` (e.g., `PurchasePackage` modal)
- Backdrop click and ESC key should close modal

## Project-Specific Business Logic

### Investment/Package System

- Users must activate account by purchasing a package
- Packages have min/max amounts, ROI percentages, activation fees
- Investment history tracked in `packages/investment-history` endpoint

### Commission Structure

- Multi-level referral system with level-based commissions
- Track direct referrals, team size, team investment
- ROI earnings and leadership income separate

### Wallet System

- Multiple wallet types: Main balance, Income wallet, Available balance
- Withdrawal limits enforced (min/max USDT)
- Multiple networks: TRC20, BEP20, ERC20 with different fees

### Dashboard Data

- Real-time stats: total investment, ROI earned, level income, reward income
- Referral link generation with social sharing
- Network statistics and rank progress tracking
- TradingView widgets for market data

## Important Notes

- **No TypeScript**: Pure JavaScript project, avoid TS suggestions
- **Token required**: Most API calls need `Authorization` header, check `token` exists before calling
- **Error messages**: Display from API when available: `error?.response?.data?.message`
- **Loading states**: Always show shimmer/spinner during data fetches
- **Mobile responsive**: All components must work on mobile (test with mobile menu)
- **Console logs**: Extensive logging in API calls - preserve for debugging
- **StrictMode disabled**: Commented out in `main.jsx`, don't re-enable

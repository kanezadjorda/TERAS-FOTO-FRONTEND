- **Server Fetching:** Use native `fetch` in Server Components for initial data load. Handle caching and revalidation using Next.js `next: { revalidate }` or `cache: 'no-store'`.
- **Client Fetching:** For client-side data fetching (or polling), use `swr`. DO NOT use manual `useEffect` + `fetch`.
- **Forms:** Use `react-hook-form` paired with `@hookform/resolvers/zod` for validation.
- **Race Conditions:** Use `AbortController` or `swr` to handle request cancellations.

silahkan baca dokumentasi API di link berikut: http://localhost:3000/api-docs

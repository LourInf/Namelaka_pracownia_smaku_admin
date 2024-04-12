import "@/styles/globals.css"; // Importing global styles in _app.js ensures that they are loaded only once for the entire application
import { SessionProvider } from "next-auth/react"; // Wrapping the component App with SessionProvider ensures that session state is accessible to all components in the app, so we can manage and maintain user sessions  effectively across all pages, ensuring that authentication state is consistently synced and accessible wherever needed in the app.

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ReactDOM from "react-dom";

import { Toasts } from "@lightit/toast";

import { env } from "./env";
import { Router } from "./router";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={env.VITE_GOOGLE_AUTH_SSO_CLIENT_ID}>
        <Router />
        {ReactDOM.createPortal(<Toasts />, document.body)}
      </GoogleOAuthProvider>
      {env.VITE_APP_ENV === "local" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

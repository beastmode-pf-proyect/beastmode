// components/AuthProvider.tsx
'use client';

import { Auth0Provider } from '@auth0/auth0-react';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <Auth0Provider
      domain="dev-2sj6t1v3uioay6ho.us.auth0.com"
      clientId="yXpiFq1KyquGJQ2Ujl2dqEgNE42p4ArM"
      authorizationParams={{
        redirect_uri: typeof window !== 'undefined' ? window.location.origin : undefined,
      }}
    >
      {children}
    </Auth0Provider>
  );
}
import '../app/styles/globals.css';

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <link href="./output.css" rel="stylesheet"></link>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
                
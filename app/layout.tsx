import "./globals.css"; // <--- THIS IS THE MAGIC LINE
import { Sidebar } from "@/components/Sidebar";
import {Providers} from "@/components/Providers"; // Ensure this path is correct

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="flex h-screen overflow-hidden">
            {/* Now Sidebar is inside Providers, so useSession will work! */}
            <Sidebar /> 
            <main className="flex-1 overflow-y-auto bg-slate-50">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
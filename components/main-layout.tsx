import  {Sidebar}  from "@/components/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* This container is the KEY to keeping them separate */}
        <div className="flex h-screen overflow-hidden">
          <Sidebar /> 
          <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
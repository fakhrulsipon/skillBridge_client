// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "SkillBridge",
  description:
    "A platform to enhance your skills and connect with like-minded individuals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

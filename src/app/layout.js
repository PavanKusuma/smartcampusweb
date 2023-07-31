import './globals.css'

export const metadata = {
  title: 'Smart Campus',
  description: 'Your campus assistant!',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

export default function ZoomLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en">
        <head>
          <link
            rel="stylesheet"
            href="https://source.zoom.us/2.18.0/css/bootstrap.css"
          />
          <link
            rel="stylesheet"
            href="https://source.zoom.us/2.18.0/css/react-select.css"
          />
        </head>
        <body style={{ margin: 0 }}>
          {children}
        </body>
      </html>
    );
  }
  
import type { ColorScheme } from "@mantine/core";
import { ColorSchemeProvider, Global, MantineProvider } from "@mantine/core";
import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";
import { useState } from "react";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Panel Credits",
  viewport: "width=device-width,initial-scale=1",
  'twitter:creator': '@mmattbtw',
  'twitter:site': '@mmattbtw',
  'twitter:card': 'summary',
});


export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        
        <MantineTheme>
            <Outlet />
        </MantineTheme>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function MantineTheme({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (


    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withNormalizeCSS
        withGlobalStyles
      >
        <Global
          styles={(theme) => ({
            a: {
              color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
              textDecoration: 'underline',
          
              '&:hover': {
                backgroundColor:
                  theme.colorScheme === 'dark'
                    ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
                    : theme.colors[theme.primaryColor][0],
                color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 3 : 7],
                textDecoration: "none",
                border: 'none',
              }
            }
          })}
        />
        {children}
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
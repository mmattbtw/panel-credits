import { Button, Container } from '@mantine/core';
import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { authenticator } from '~/services/auth/auth.server';
import type { sessionType } from '~/typings/typings';

  
export let loader: LoaderFunction = async ({ request }) => {
	const session: sessionType = await authenticator.isAuthenticated(request, {
	});

    if (!session) return null

    return session as sessionType
};

export default function MyApp() {
  const session = useLoaderData() as sessionType
  return (
    <Container>
      <h1>hey {session?.json.display_name}</h1>
      
      { !session ?
        <Button component={Link} to="/login" prefetch='intent'>Login</Button>
        : <Button disabled>Login</Button>
      }
    </Container>
  )
}
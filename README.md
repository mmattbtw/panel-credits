# Panel Credits (web)

The website for [Panel Credits](https://panelcredits.mmattDonk.com)

## The Idea
The idea is that you (the streamer) gives your viewer a "credit". This credit can be used to submit a panel (panels are what is below your twitch stream) for your Twitch Channel. This viewer can then submit a panel idea, then you the streamer can accept/deny it and then it will be added to their page (panelcredits.mmattDonk.com/streamername). This is mainly a "for fun" project, but yeah. 

## The Goal
The goal is to have a "Twitch Exntension" panel to automatically show these viewer made panels.
![image](https://user-images.githubusercontent.com/30363562/173955558-1af369ba-d0b1-4b6b-be6d-7718bc262a08.png)

## Stack

-   [Remix](https://remix.run) (React Framework)
-   [Mantine](https://mantine.dev) (UI Components Library)
-   [Prisma](https://prisma.io) (Database)
-   [Vercel](https://vercel.com) (Hosting)
-   [TypeScript](https://www.typescriptlang.org) (Language)

## `.env` file template:

```
CALLBACK_URL=callback URL for the Twitch API. (dev.twitch.tv) (http://localhost:3000/auth/twitch/callback)
CLIENT_ID=client ID from the Twitch API. (dev.twitch.tv)
CLIENT_SECRET=client secret from the Twitch API. (dev.twitch.tv)

DATABASE_URL=URL for the Prisma database. I are using the Prisma PostgreSQL data proxy service.
```

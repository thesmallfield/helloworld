export const dynamic = 'force-dynamic';
export const metadata = { title: 'Home' };
export default function Home() { return <h1>Home page: {process.env.GREETING ?? 'no greeting'}</h1>; }

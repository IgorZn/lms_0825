import { UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <div>
      <p className="text-3xl">This is protected page</p>
      <UserButton />
    </div>
  );
}

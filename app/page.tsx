import { Button } from "@/components/ui/button";
import UserButton from "@/modules/auth/components/user-button";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center ">
      <Button>Click Me</Button>
      <UserButton/>
    </main>
  );
}

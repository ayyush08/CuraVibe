import { useSession } from "next-auth/react";


//to use current user in client components
export const useCurrentUser = () => {
    const { data: session } = useSession();
    return session?.user;
};

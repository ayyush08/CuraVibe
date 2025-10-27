
import React from 'react'
import { LogoutButtonProps } from '../types'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react';

const LogoutButton = ({ children }: LogoutButtonProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const onLogout = async () => {
        if(pathname === '/'){
            await signOut({redirect: false});
        }else{
            await signOut()
        }
        
        router.refresh()
    }
    return (
        <span className='cursor-pointer' onClick={onLogout}>
            {children}
        </span>
    )
}

export default LogoutButton

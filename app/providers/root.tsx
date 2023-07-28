"use client"
import React from 'react'
import AuthContext from './auth-context'
import { WalletConnectProvider } from './walletconnect'
import { SessionProvider } from 'next-auth/react'

type ProviderType = {
    children: React.ReactNode
}

const Providers = ({ children }: ProviderType) => {
    return (
        <SessionProvider>
            <WalletConnectProvider>
                <AuthContext>
                    {children}
                </AuthContext>
            </WalletConnectProvider>
        </SessionProvider>
    )
}

export default Providers
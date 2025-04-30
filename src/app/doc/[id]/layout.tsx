import RoomProvider from "@/components/RoomProvider";
import { auth } from "@clerk/nextjs/server";
import { ReactNode } from 'react';

interface DocLayoutProps {
    children: ReactNode;
    params: Promise<{ id: string }>;
}

export default async function DocLayout(
    { children, params }: DocLayoutProps) {

    // Destructured here to prevent error
    const { id } = await params

    // Protect the route with Clerk
    await auth.protect()

    return (
        <RoomProvider roomId={id}>
            {children}
        </RoomProvider>
    )
}
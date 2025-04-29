import RoomProvider from "@/components/RoomProvider";
import { auth } from "@clerk/nextjs/server";

export default async function DocLayout(
    { children, params} : { 
        children: React.ReactNode, 
        params: { id: string } 
    }) {

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
import liveblocks from '@/lib/liveblocks';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../firebase-admin';

export async function POST(req: NextRequest){
    await auth.protect();

    console.log('Started POST request')

    // Check authorised before entering room
    const { sessionClaims } = await auth()
    const { room } = await req.json()

    // Prepare session for logged in user
    const session = liveblocks.prepareSession(sessionClaims?.email!, {
        userInfo: {
            name: sessionClaims?.fullName!,
            email: sessionClaims?.email!,
            avatar: sessionClaims?.image!,
        },
    })

    // Check rooms user has access to
    const usersInRoom = await adminDb
        .collectionGroup('rooms')
        .where('userId', '==', sessionClaims?.email)
        .get()

    // Check user has access to room
    const userInRoom = usersInRoom.docs.find((doc) => doc.id === room)

    // If user has access to room, allow access
    // and return session token
    if (userInRoom?.exists){
        session.allow(room, session.FULL_ACCESS)
        const { body, status } = await session.authorize()
        return new Response(body, { status })
    } else {
        console.log('User does not have access to room')
    // Otherwise deny access
    // and return error message
        return NextResponse.json(
            { message: 'You do not have access to this room' },
            { status: 403 }
    )}
} 
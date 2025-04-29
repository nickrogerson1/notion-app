'use server';
import { auth } from '@clerk/nextjs/server';
import { adminDb } from '../firebase-admin';
import liveblocks from '@/lib/liveblocks';

export async function createNewDocument() {
    await auth.protect();

    const { sessionClaims } = await auth()

    const docCollectionRef = adminDb.collection('documents');
    const docRef = await docCollectionRef.add({
        title: 'New Doc',
    });

    await adminDb.collection('users').doc(sessionClaims?.email!).collection
    ('rooms').doc(docRef.id).set({
        userId: sessionClaims?.email,
        role: 'owner',
        createdAt: new Date(),
        roomId: docRef.id,
    });

    return { docId: docRef.id };
}


export async function deleteDocument(roomId: string) {
  await auth.protect();

  console.log('deleteDocument', roomId)

  try {
    // Delete the document from the 'documents' collection
    await adminDb.collection('documents').doc(roomId).delete();

    const query = await adminDb
        .collectionGroup('rooms')
        .where('roomId', '==', roomId)
        .get();
    
    const batch = adminDb.batch();

    // Delete the document from the 'rooms' subcollection for each user
    query.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });

    await batch.commit();

    // Delete the room from Liveblocks
    await liveblocks.deleteRoom(roomId);

    return { success: true };

  } catch(e){
    console.error('Error deleting document:', e);
    return { success: false };
  }
}


export async function inviteUserToDocument(roomId: string, email: string) {
    await auth.protect();

    const { sessionClaims } = await auth()

    try {
        // Add the user to the 'rooms' subcollection for the document
        await adminDb.collection('users')
        .doc(email)
        .collection('rooms')
        .doc(roomId)
        .set({
            userId: email,
            role: 'editor',
            createdAt: new Date(),
            roomId
        });

        return { success: true };
    } catch (e) {
        console.error('Error inviting user:', e);
        return { success: false };
    }
}


export async function removeUserFromDocument(roomId: string, email: string) {
    await auth.protect();

    try {
        // Remove the user from the 'rooms' subcollection for the document
        await adminDb.collection('users')
        .doc(email)
        .collection('rooms')
        .doc(roomId)
        .delete();

        return { success: true };
    } catch (e) {
        console.error('Error removing user:', e);
        return { success: false };
    }
}

import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { useRoom } from "@liveblocks/react/suspense";
import { collectionGroup, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";

export default function useOwner() {
    const { user } = useUser()
    const room = useRoom()
    const [isOwner, setIsOwner] = useState(false)
    const [usersInRoom, loading, error] = useCollection(
      user && query(collectionGroup(db, 'rooms'), where('roomId', '==', room.id))
    )

    useEffect(() => {
      if (usersInRoom?.docs && usersInRoom.docs.length > 0) {
        // Check if the user is an owner in the room
        const owners = usersInRoom.docs.filter((doc) => doc.data().role === 'owner')

        if (owners.some(owner => owner.data().userId === user?.emailAddresses[0].toString())){
          setIsOwner(true)
        }
    }
      
    }, [usersInRoom, room, user])

    return isOwner
  
}
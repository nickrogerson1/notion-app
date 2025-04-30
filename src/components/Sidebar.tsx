'use client'

import { MenuIcon } from "lucide-react"
import NewDocumentButton from "./NewDocumentButton"
import { useCollection } from "react-firebase-hooks/firestore"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"

import { useUser } from "@clerk/nextjs"
import { db } from "@/firebase"
import { query, where, collectionGroup, DocumentData } from "firebase/firestore"   
import { useEffect, useState } from "react"
import SideBarOption from "./SidebarOption"

interface RoomDocument extends DocumentData {
    userId: string
    role: 'owner' | 'editor'
    createdAt: string
    roomId: string
}
  

export default function Sidebar() {

    const { user } = useUser()
    const [groupedData, setGroupedData] = useState<{
        owner: RoomDocument[]
        editor: RoomDocument[]
    }>({
        owner: [],
        editor: [],
    })


    const [ data, loading, error ] = useCollection(
        user && 
            query(
                collectionGroup(db, 'rooms'),
                where('userId', '==', user.emailAddresses[0].toString()),
            )
        )

    useEffect(() => {
        if (!data) return

        const grouped = data.docs.reduce<{
            owner: RoomDocument[]
            editor: RoomDocument[]
        }>(
            (acc, curr) => {
                const roomData = curr.data() as RoomDocument

                if(roomData.role === 'owner') {
                    acc.owner.push({
                        ...roomData,
                        id: curr.id,
                    })
                } else {
                    acc.editor.push({
                        ...roomData,
                        id: curr.id,
                    })   
                }
                return acc
            },
            { owner: [], editor: [] }
        )

    setGroupedData(grouped)

    }, [data])

    const menuOptions = (
        <>
        <NewDocumentButton />

        <div className="flex py-4 flex-col space-y-4 md:max-w-36">
        { /* My documents */}
        {groupedData.owner.length === 0 ? (
            <h2 className="text-gray-500 font-semibold text-sm">
                No documents found
            </h2>
        ): (
            <>
            <h2 className="text-gray-500 font-semibold text-sm">My Documents</h2>
            {groupedData.owner.map(doc => (
                <SideBarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
            ))}
            </>
        )}
        
        {/* Shared with me */}
        {groupedData.editor.length > 0 && (
            <>
            <h2 className="text-gray-500 font-semibold text-sm">Shared with me</h2>
            {groupedData.editor.map(doc => (
                <SideBarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
            ))}
            </>
        )}
        </div>
        </>
    )


  return (
    <div className="p-2 md:p-5 bg-gray-200 relative">
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger>
                    <MenuIcon className="p-2 hover:opacity-30 rounded-lg" size={40} />
                </SheetTrigger>
                <SheetContent side="left">
                    <SheetHeader className="flex flex-col items-center justify-center">
                        <SheetTitle>Menu</SheetTitle>
                        <div>{menuOptions}</div>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </div>
        <div className="hidden md:inline">{menuOptions}</div>
    </div>
  )
}
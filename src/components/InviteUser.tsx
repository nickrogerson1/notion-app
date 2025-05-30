'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { FormEvent, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { inviteUserToDocument } from "../../actions/actions";
import { toast } from "sonner";
import { Input } from "./ui/input";
   

export default function InviteUser() {
    const [isOpen, setIsOpen] = useState(false)
    const [email, setEmail] = useState('')
    const [isPending, startTransition] = useTransition()
    const pathname = usePathname()

    const handleInvite = async (e: FormEvent) => {
        e.preventDefault()

        const roomId = pathname.split("/").pop()
        if (!roomId) return
    

        startTransition(async () => {
            const { success } = await inviteUserToDocument(roomId, email)

            if (success) {
                setIsOpen(false)
                setEmail('')
                toast.success('User added to room successfully')
            } else {
                toast.error('Error adding user to room')
            }
        })
    }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Button asChild variant="outline">
            <DialogTrigger>Invite</DialogTrigger>
        </Button>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Invite a User to collaborate with you.</DialogTitle>
            <DialogDescription>
                This will delete the document and all of its contents removing all users from it.
            </DialogDescription>
            </DialogHeader>
            
            <form className='flex gap-2' onSubmit={handleInvite}>
                <Input
                    type="email"
                    placeholder="Enter email address"
                    className="w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" disabled={!email || isPending}>
                    {isPending ? 'Inviting...' : 'Invite'}
                </Button>
            </form>

        </DialogContent>
    </Dialog>
)}
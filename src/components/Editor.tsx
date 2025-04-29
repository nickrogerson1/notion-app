'use client';

import { useRoom } from "@liveblocks/react/suspense";
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { Button } from "@/components/ui/button";
import { SunIcon, MoonIcon } from "lucide-react";
import { BlockNoteView } from "@blocknote/shadcn";
import { BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/shadcn/style.css";
import "@blocknote/core/fonts/inter.css";
import stringToColor from "@/lib/stringToColor";
import { useSelf } from "@liveblocks/react";
import TranslateDocument from "./TranslateDocument";
import ChatToDocument from "./ChatToDocument";

type EditorProps = {
    doc: Y.Doc
    provider: any
    darkMode: boolean
    setEditorTextValue: any
}

const BlockNote = ({ doc, provider, darkMode, setEditorTextValue }: EditorProps) => {
    const userInfo = useSelf(me => me.info)

    const editor: BlockNoteEditor = useCreateBlockNote({
        collaboration: {
            provider,
            fragment: doc.getXmlFragment("document-store"),
            user: {
                name: userInfo?.name || "Anonymous User",
                color: stringToColor(userInfo?.email)
            },
        },
    })

    // Set the value here of all the text to be sent to the summariser
    setEditorTextValue(editor._tiptapEditor.getText())


  return (
    <div className="relative max-w-6xl mx-auto">
        <BlockNoteView
            editor={editor} 
            className="min-h-screen"
            theme={darkMode ? "dark" : "light"}
        />
    </div>
  )
}

export default function Editor() {
    const room = useRoom()
    const [doc, setDoc] = useState<Y.Doc>()
    const [provider, setProvider] = useState<LiveblocksYjsProvider>()
    const [darkMode, setDarkMode] = useState(false)
    const [editorTextValue, setEditorTextValue] = useState('');

    useEffect(() => {
        const yDoc = new Y.Doc()
        const yProvider = new LiveblocksYjsProvider(room, yDoc)
        setDoc(yDoc)
        setProvider(yProvider)

        return () => {
            yProvider?.destroy()
            yDoc?.destroy()
        }
    }, [room])

    if (!doc || !provider) return null


    const style = `hover:text-white ${
        darkMode 
        ? "text-gray-300 bg-gray-700 hover:bg-gray-100 hover:text-gray-700" 
        : "text-gray-700 bg-gray-200 hover:bg-gray-300 hover:text-gray-700"
    }`


  return (
    <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 justify-end mb-10">

            < TranslateDocument editorTextValue={editorTextValue} />
            < ChatToDocument doc={doc} />

            {/* Dark Mode */}
            <Button className={style} onClick={() => setDarkMode(!darkMode)} >
                {darkMode ? <SunIcon /> : <MoonIcon />}
            </Button>
        </div>


        {/* Block Note */}
        <BlockNote doc={doc} provider={provider} darkMode={darkMode} setEditorTextValue={setEditorTextValue}/>
    </div>
  )
}
'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
import { Button } from "./ui/button";
import { FormEvent, useState, useTransition } from "react";
import { BotIcon, LanguagesIcon } from "lucide-react"
import { toast } from "sonner";
import Markdown from 'react-markdown'

// type Language = 
//     | 'english'
//     | 'spanish'
//     | 'french'
//     | 'german'
//     | 'italian'
//     | 'portuguese'
//     | 'chinese'
//     | 'japanese'
//     | 'korean'
//     | 'russian'
//     | 'arabic'
//     | 'hindi'

const languages = {
    'english': 'en',
    'spanish': 'es',
    'french': 'fr',
    'german': 'de',
    'italian': 'it',
    'portuguese': 'pt',
    'chinese': 'zh',
    'japanese':'ja',
    'korean': 'ko',
    'russian': 'ru',
    'arabic': 'ar',
    'hindi': 'hi'
}



export default function TranslateDocument({ editorTextValue }: {editorTextValue: string}) {
    const [isOpen, setIsOpen] = useState(false)
    const [language, setLanguage] = useState('')
    const [summary, setSummary] = useState('')
    const [question, setQuestion] = useState('')
    const [isPending, startTransition] = useTransition()

    console.log(`Editor Text Value: ${editorTextValue}`)

    const handleAskQuestion = async (e: FormEvent) => {
        e.preventDefault()
        
        startTransition(async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/translateDocument`, 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        documentData: editorTextValue.replace(/(\r\n|\n|\r)/gm, " "),
                        targetLang: language,
                    }),
                })

                if (res.ok) {
                    const { translated_text } = await res.json()
                    setSummary(translated_text)
                    toast.success('Document summary translation successful!')
                }
        })
    }


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <Button asChild variant="outline">
                <DialogTrigger>
                    <LanguagesIcon />
                    Translate
                </DialogTrigger>
            </Button>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Translate document</DialogTitle>
                    <DialogDescription>
                        Select a language to translate and summarise the document.
                    </DialogDescription>
                
                <hr className="mt-5" />

                {question && <p className="mt-5 text-gray-500">Q: {question}</p>}
                </DialogHeader>

                {summary && (
                    <div className="flex flex-col items-start max-h96 overflow-y-scroll gap-2 p-5 bg-gray-100">
                        <div className="flex">
                            <BotIcon className="w-10 flex-shrink-0" />
                            <p className="font-bold">
                                GPT {isPending ? 'is thinking...' : 'says:'}
                            </p>
                        </div>
                        <div>{isPending ? 'Thinking...' : <Markdown>{summary}</Markdown>}</div>
                    </div>
                )}
                
                <form className='flex gap-2' onSubmit={handleAskQuestion}>
                    <Select
                        value={language}
                        onValueChange={value => setLanguage(value)}
                    > 

                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a language" />
                        </SelectTrigger>

                        <SelectContent>
                            {Object.entries(languages).map(lang => (
                                <SelectItem key={lang[1]} value={lang[1]}>
                                    {lang[0].charAt(0).toUpperCase() + lang[0].slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button type="submit" disabled={!language || isPending}>
                        {isPending ? 'Translating...' : 'Translate'}
                    </Button>
                </form>
    
            </DialogContent>
        </Dialog>
    )}
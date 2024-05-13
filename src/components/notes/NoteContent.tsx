'use client'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { Button } from '../ui/button'
import NoteEditor from './NoteEditor'
import { useNote, useUpdateNote } from './Notes.query'
import { activeNoteAtom } from './notes.utils'

export default function NoteContent() {
	const [activeNote, setActiveNote] = useAtom(activeNoteAtom)

	const { mutate: updateNote, isPending } = useUpdateNote(activeNote)
	const { data, isLoading: isNoteLoading } = useNote(activeNote)
	const [html, setHtml] = useState(data?.content)

	function updateNoteContent() {
		updateNote(
			{ content: html },
			{
				onError: (err) => {
					console.log(err)
				},
			}
		)
	}

	useHotkeys('mod+s', () => updateNoteContent(), {
		preventDefault: true,
		enableOnContentEditable: true,
	})

	if (!activeNote) {
		return (
			<div className="flex-1 grid place-content-center">
				<div className="flex flex-col items-center justify-center">
					<p className="text-xl font-medium text-muted-foreground">No note is open</p>
					<Button variant="link">Create new (Ctrl + N)</Button>
				</div>
			</div>
		)
	}

	if (isNoteLoading) {
		return <p>Loading...</p>
	}

	return (
		<div className="flex-1 overflow-auto relative">
			<div className="flex justify-between p-4 sticky top-0 z-10 bg-white border-b">
				<h1 className="text-xl font-bold">{data?.title}</h1>
				<div className="flex items-center space-x-4">{isPending ? <div>Saving...</div> : null}</div>
			</div>
			<div className="max-w-4xl mx-auto my-6">
				<NoteEditor initialValue={data?.content} onChange={(data) => setHtml(data)} />
			</div>
		</div>
	)
}

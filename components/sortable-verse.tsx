"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"

interface Verse {
  id: string
  text: string
  rhyme: string
  meter: string
}

interface SortableVerseProps {
  id: string
  verse: Verse
}

export function SortableVerse({ id, verse }: SortableVerseProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center p-3 bg-white border rounded-md ${
        isDragging ? "shadow-lg opacity-75" : "shadow-sm"
      } transition-colors hover:bg-stone-50`}
    >
      <div
        {...attributes}
        {...listeners}
        className="mr-3 cursor-grab active:cursor-grabbing text-stone-400 hover:text-stone-600"
      >
        <GripVertical className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="text-stone-800">{verse.text}</p>
      </div>
      <div className="ml-2 text-xs text-stone-500 hidden sm:block">
        <span className="px-1.5 py-0.5 bg-stone-100 rounded mr-1">{verse.rhyme}</span>
        <span className="px-1.5 py-0.5 bg-stone-100 rounded">{verse.meter}</span>
      </div>
    </div>
  )
}


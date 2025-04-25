"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import type { ToneType } from "@/app/actions"

export function useUrlParams(
  setInputText: (text: string) => void,
  setTone: (tone: ToneType) => void,
  handleTransform: () => void,
) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const text = searchParams.get("text")
    const tone = searchParams.get("tone") as ToneType

    if (text) {
      setInputText(text)

      if (tone && ["gen-z", "shakespeare", "pirate", "corporate", "yoda"].includes(tone)) {
        setTone(tone)
      }

      // Trigger transformation after a short delay to ensure state is updated
      setTimeout(() => {
        handleTransform()
      }, 100)
    }
  }, [searchParams, setInputText, setTone, handleTransform])
}

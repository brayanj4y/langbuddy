"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const images = Array.from({ length: 12 }, (_, i) => `/${i + 1}.png`)

export function ImageTransition() {
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0)
    const [isTransitioning, setIsTransitioning] = React.useState(false)

    React.useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true)
            setTimeout(() => {
                setCurrentImageIndex((prev) => (prev + 1) % images.length)
                setIsTransitioning(false)
            }, 500)
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="absolute left-1/2 -translate-x-1/2 w-[280px] h-[250px]">
            <Image
                src={images[currentImageIndex]}
                alt="Decorative image"
                fill
                className={cn(
                    "object-contain transition-all duration-1000",
                    isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
                )}
                priority={currentImageIndex === 0}
            />
        </div>
    )
}
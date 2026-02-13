import * as React from "react"
import { cn } from "@/lib/utils"

function Badge({ className, variant, ...props }) {
    return (
        <div className={cn("badge-base", variant, className)} {...props} />
    )
}

export { Badge }

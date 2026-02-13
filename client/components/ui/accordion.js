"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const Accordion = ({ children, className }) => (
    <div className={cn("space-y-4", className)}>{children}</div>
)

const AccordionItem = ({ children, className, value, activeValue, onValueChange }) => {
    const isOpen = value === activeValue
    return (
        <div className={cn("card-base overflow-hidden", className)}>
            {React.Children.map(children, child =>
                React.cloneElement(child, { isOpen, onToggle: () => onValueChange(isOpen ? null : value) })
            )}
        </div>
    )
}

const AccordionTrigger = ({ children, className, isOpen, onToggle }) => (
    <button
        onClick={onToggle}
        className={cn(
            "flex w-full items-center justify-between p-8 text-left text-2xl font-black transition-all hover:bg-gray-50",
            className
        )}
    >
        {children}
        <ChevronDown
            className={cn("h-6 w-6 shrink-0 transition-transform duration-300", isOpen && "rotate-180")}
        />
    </button>
)

const AccordionContent = ({ children, className, isOpen }) => (
    <AnimatePresence initial={false}>
        {isOpen && (
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <div className={cn("p-8 pt-0 text-lg font-bold text-gray-500 leading-relaxed", className)}>
                    {children}
                </div>
            </motion.div>
        )}
    </AnimatePresence>
)

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

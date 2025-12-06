"use client"

import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-muted/50 border-t border-border">
            <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                <div className="flex justify-center space-x-6 md:order-2">
                    <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                        <span className="sr-only">Twitter</span>
                        <Twitter className="h-5 w-5" />
                    </Link>
                    <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                        <span className="sr-only">GitHub</span>
                        <Github className="h-5 w-5" />
                    </Link>
                    <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                        <span className="sr-only">LinkedIn</span>
                        <Linkedin className="h-5 w-5" />
                    </Link>
                </div>
                <div className="mt-8 md:order-1 md:mt-0">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4 md:mb-0">
                        <div className="h-6 w-6 bg-primary rounded" />
                        <span className="font-bold text-lg">SaloneVest</span>
                    </div>
                    <p className="text-center text-xs leading-5 text-muted-foreground md:text-left mt-2">
                        &copy; 2025 SaloneVest. Built for the Sierra Leone Diaspora.
                    </p>
                </div>
            </div>
        </footer>
    )
}

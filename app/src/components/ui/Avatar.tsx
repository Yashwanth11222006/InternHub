"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
        name?: string;
        size?: 'sm' | 'md' | 'lg';
    }
>(({ className, name, size = 'md', ...props }, ref) => {
    const sizeClasses = {
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
    };

    const initials = name
        ? name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "??";

    return (
        <AvatarPrimitive.Root
            ref={ref}
            className={cn(
                "relative flex shrink-0 overflow-hidden rounded-full transition-transform hover:scale-105",
                sizeClasses[size],
                className
            )}
            {...props}
        >
            <AvatarPrimitive.Image
                className="aspect-square h-full w-full"
                src={undefined} // Add prop if needed
            />
            <AvatarPrimitive.Fallback
                className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-primary font-bold"
            >
                {initials}
            </AvatarPrimitive.Fallback>
        </AvatarPrimitive.Root>
    );
})
Avatar.displayName = AvatarPrimitive.Root.displayName

export default Avatar;
export { Avatar as AvatarRoot };

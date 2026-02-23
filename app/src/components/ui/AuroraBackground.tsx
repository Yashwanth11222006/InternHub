"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
    children: ReactNode;
    showRadialGradient?: boolean;
}

export const AuroraBackground = ({
    className,
    children,
    showRadialGradient = true,
    ...props
}: AuroraBackgroundProps) => {
    return (
        <div
            className={cn(
                "relative flex flex-col items-center justify-center bg-white dark:bg-black text-slate-950 transition-bg",
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className={cn(
                        `
          [--white-gradient:repeating-linear-gradient(100deg,#ffffff_0%,#ffffff_7%,transparent_10%,transparent_12%,#ffffff_16%)]
          [--dark-gradient:repeating-linear-gradient(100deg,#000000_0%,#000000_7%,transparent_10%,transparent_12%,#000000_16%)]
          [--aurora:repeating-linear-gradient(100deg,#3b82f6_0%,#a5b4fc_10%,#93c5fd_20%,#ddd6fe_30%,#60a5fa_40%)]
          [background-image:var(--white-gradient),var(--aurora)]
          dark:[background-image:var(--dark-gradient),var(--aurora)]
          [background-size:300%,_200%]
          [background-position:50%_50%,50%_50%]
          filter blur-[6px] invert dark:invert-0
          after:content-[""] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] 
          after:dark:[background-image:var(--dark-gradient),var(--aurora)]
          after:[background-size:200%,_100%] 
          after:[animation:aurora_60s_linear_infinite] after:[background-attachment:fixed] after:mix-blend-difference
          pointer-events-none
          absolute -inset-[10px] opacity-80 will-change-transform`,

                        showRadialGradient &&
                        `[mask-image:radial-gradient(ellipse_at_50%_50%,black_30%,transparent_90%)]`
                    )}
                ></div>
            </div>
            {/* Frosted blur layer between animation and content */}
            <div className="absolute inset-0 backdrop-blur-[2px] bg-black/20 pointer-events-none z-[5]" />
            <div className="relative z-10 w-full">
                {children}
            </div>
        </div>
    );
};

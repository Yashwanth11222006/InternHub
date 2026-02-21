'use client';

import { Button as HeroButton, ButtonProps as HeroButtonProps } from "@heroui/react";
import { motion } from "framer-motion";

interface CustomButtonProps extends HeroButtonProps {
    glow?: boolean;
}

export function PremiumButton({ children, glow, className, ...props }: CustomButtonProps) {
    return (
        <motion.div
            whileHover={glow ? { scale: 1.02 } : {}}
            whileTap={{ scale: 0.98 }}
            className="relative w-fit h-fit"
        >
            {glow && (
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />
            )}
            <HeroButton
                className={`relative font-semibold ${className}`}
                radius="lg"
                {...props}
            >
                {children}
            </HeroButton>
        </motion.div>
    );
}

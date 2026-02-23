import type React from "react"
import { motion } from "framer-motion"

const BoxLoader: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center py-20 w-full min-h-[200px]">
            <div className="relative scale-110 md:scale-150">
                <div className="boxes">
                    <div className="box box-1">
                        <div className="face face-front" />
                        <div className="face face-right" />
                        <div className="face face-top" />
                        <div className="face face-back" />
                    </div>
                    <div className="box box-2">
                        <div className="face face-front" />
                        <div className="face face-right" />
                        <div className="face face-top" />
                        <div className="face face-back" />
                    </div>
                    <div className="box box-3">
                        <div className="face face-front" />
                        <div className="face face-right" />
                        <div className="face face-top" />
                        <div className="face face-back" />
                    </div>
                    <div className="box box-4">
                        <div className="face face-front" />
                        <div className="face face-right" />
                        <div className="face face-top" />
                        <div className="face face-back" />
                    </div>
                </div>
            </div>

            {/* Ambient Shadow/Glow */}
            <motion.div
                animate={{
                    opacity: [0.2, 0.4, 0.2],
                    scale: [1, 1.2, 1]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -z-10 w-24 h-12 bg-blue-500/20 blur-3xl rounded-full translate-y-20"
            />
        </div>
    )
}

export default BoxLoader

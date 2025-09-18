import { motion } from "motion/react"
import React from "react"

// Animation variants for different entrance effects
export const fadeInUp = {
    hidden: {
        opacity: 0,
        y: 30,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0, 0.2538, 0.728, 1.1004], // Using motion MCP spring curve
        },
    },
}

export const fadeInDown = {
    hidden: {
        opacity: 0,
        y: -30,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0, 0.2538, 0.728, 1.1004],
        },
    },
}

export const fadeInLeft = {
    hidden: {
        opacity: 0,
        x: -30,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: [0, 0.2538, 0.728, 1.1004],
        },
    },
}

export const fadeInRight = {
    hidden: {
        opacity: 0,
        x: 30,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: [0, 0.2538, 0.728, 1.1004],
        },
    },
}

export const scaleIn = {
    hidden: {
        opacity: 0,
        scale: 0.8,
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.65,
            ease: [0, 0.1162, 0.3622, 0.6245], // Using motion MCP bouncy spring
        },
    },
}

export const bounceIn = {
    hidden: {
        opacity: 0,
        scale: 0.3,
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 1,
            ease: [0, 0.0008, 0.0031, 0.0069], // Using motion MCP bounce curve
        },
    },
}

// Stagger item variant
export const staggerItem = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0, 0.2538, 0.728, 1.1004],
        },
    },
}

// Simple InView component - shows content immediately, then animates
export const SimpleInViewSection = ({ children, className = "", animation = "fadeInUp", delay = 0, ...props }) => {
    const variants = {
        fadeInUp,
        fadeInDown,
        fadeInLeft,
        fadeInRight,
        scaleIn,
        bounceIn,
    }

    return (
        <motion.div
            className={className}
            initial={{ opacity: 1 }} // Start visible
            whileInView="visible"
            viewport={{ once: true, margin: "-100px", amount: 0.1 }}
            variants={variants[animation]}
            transition={{ delay }}
            {...props}
        >
            {children}
        </motion.div>
    )
}

// Simple Stagger component - shows content immediately, then animates
export const SimpleInViewStagger = ({ children, className = "", staggerDelay = 0.1, ...props }) => {
    const staggerContainer = {
        visible: {
            transition: {
                staggerChildren: staggerDelay,
                delayChildren: 0.1,
            },
        },
    }

    return (
        <motion.div
            className={className}
            initial={{ opacity: 1 }} // Start visible
            whileInView="visible"
            viewport={{ once: true, margin: "-100px", amount: 0.1 }}
            variants={staggerContainer}
            {...props}
        >
            {React.Children.map(children, (child, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 1 }} // Start visible
                    whileInView="visible"
                    variants={staggerItem}
                >
                    {child}
                </motion.div>
            ))}
        </motion.div>
    )
}

import React, { useRef, useEffect } from "react"
import { motion } from "motion/react"
import { inView, animate, stagger } from "motion"

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

// Container variants for staggered animations
export const staggerContainer = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
}

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

// Hover animations
export const hoverScale = {
    hover: {
        scale: 1.05,
        transition: {
            duration: 0.3,
            ease: [0, 0.2538, 0.728, 1.1004],
        },
    },
}

export const hoverLift = {
    hover: {
        y: -8,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
        transition: {
            duration: 0.3,
            ease: [0, 0.2538, 0.728, 1.1004],
        },
    },
}

// Floating animation
export const float = {
    animate: {
        y: [-5, 5, -5],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
}

// Pulse animation
export const pulse = {
    animate: {
        scale: [1, 1.05, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
}

// Motion component wrapper with common animations
export const MotionDiv = ({ children, variant = "fadeInUp", delay = 0, ...props }) => {
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
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={variants[variant]}
            transition={{ delay }}
            {...props}
        >
            {children}
        </motion.div>
    )
}

// Staggered container component
export const MotionStagger = ({ children, ...props }) => {
    return (
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} {...props}>
            {children}
        </motion.div>
    )
}

// Individual stagger item
export const MotionStaggerItem = ({ children, ...props }) => {
    return (
        <motion.div variants={staggerItem} {...props}>
            {children}
        </motion.div>
    )
}

// Custom hook using Motion's inView for scroll-triggered animations
export const useMotionInView = (options = {}) => {
    const ref = useRef(null)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const defaultOptions = {
            margin: "-100px",
            amount: 0.3,
            ...options,
        }

        return inView(
            element,
            (info) => {
                if (info.isIntersecting) {
                    animate(element, { opacity: 1, y: 0 }, { duration: 0.6, ease: [0, 0.2538, 0.728, 1.1004] })
                }
            },
            defaultOptions
        )
    }, [])

    return ref
}

// Enhanced InView component using Framer Motion's whileInView (more reliable)
export const InViewSection = ({ children, className = "", animation = "fadeInUp", delay = 0, ...props }) => {
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
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px", amount: 0.1 }}
            variants={variants[animation]}
            transition={{ delay }}
            style={{ opacity: 1 }} // Fallback to ensure content is visible
            {...props}
        >
            {children}
        </motion.div>
    )
}

// Staggered InView component using Framer Motion's whileInView (more reliable)
export const InViewStagger = ({ children, className = "", staggerDelay = 0.1, ...props }) => {
    const staggerContainer = {
        hidden: {},
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
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px", amount: 0.1 }}
            variants={staggerContainer}
            style={{ opacity: 1 }} // Fallback to ensure content is visible
            {...props}
        >
            {React.Children.map(children, (child, index) => (
                <motion.div key={index} variants={staggerItem}>
                    {child}
                </motion.div>
            ))}
        </motion.div>
    )
}

// Helper functions for animations
const getInitialTransform = (animation) => {
    switch (animation) {
        case "fadeInUp":
            return "translateY(30px)"
        case "fadeInDown":
            return "translateY(-30px)"
        case "fadeInLeft":
            return "translateX(-30px)"
        case "fadeInRight":
            return "translateX(30px)"
        case "scaleIn":
            return "scale(0.8)"
        case "bounceIn":
            return "scale(0.3)"
        default:
            return "translateY(30px)"
    }
}

const getAnimationConfig = (animation, delay) => {
    const baseConfig = {
        options: {
            duration: 0.6,
            delay,
            ease: [0, 0.2538, 0.728, 1.1004],
        },
    }

    switch (animation) {
        case "fadeInUp":
        case "fadeInDown":
            return {
                to: { opacity: 1, y: 0 },
                ...baseConfig,
            }
        case "fadeInLeft":
        case "fadeInRight":
            return {
                to: { opacity: 1, x: 0 },
                ...baseConfig,
            }
        case "scaleIn":
            return {
                to: { opacity: 1, scale: 1 },
                options: {
                    ...baseConfig.options,
                    ease: [0, 0.1162, 0.3622, 0.6245],
                },
            }
        case "bounceIn":
            return {
                to: { opacity: 1, scale: 1 },
                options: {
                    ...baseConfig.options,
                    duration: 1,
                    ease: [0, 0.0008, 0.0031, 0.0069],
                },
            }
        default:
            return {
                to: { opacity: 1, y: 0 },
                ...baseConfig,
            }
    }
}

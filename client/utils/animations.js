// Framer Motion animation variants library for consistent animations across the app

export const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

export const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

export const fadeInDown = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

export const fadeInLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

export const fadeInRight = {
    hidden: { opacity: 0, x: 30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

export const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

export const scaleInSpring = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

export const slideInLeft = {
    hidden: { x: -100, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

export const slideInRight = {
    hidden: { x: 100, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

export const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
    }
};

export const hoverScale = {
    rest: { scale: 1 },
    hover: {
        scale: 1.05,
        transition: { duration: 0.2, ease: "easeInOut" }
    },
    tap: { scale: 0.95 }
};

export const hoverGlow = {
    rest: {
        boxShadow: "0 0 20px rgba(138, 43, 226, 0.4)"
    },
    hover: {
        boxShadow: "0 0 40px rgba(138, 43, 226, 0.8)",
        transition: { duration: 0.3 }
    }
};

export const floatAnimation = {
    animate: {
        y: [-10, 10, -10],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

export const rotateAnimation = {
    animate: {
        rotate: [0, 360],
        transition: {
            duration: 20,
            repeat: Infinity,
            ease: "linear"
        }
    }
};

export const pulseAnimation = {
    animate: {
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

export const pageTransition = {
    hidden: { opacity: 0, y: 20 },
    enter: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: { duration: 0.3, ease: "easeIn" }
    }
};

export const modalBackdrop = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.2 }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.2 }
    }
};

export const modalContent = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: "spring", damping: 25, stiffness: 300 }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 20,
        transition: { duration: 0.2 }
    }
};

export const cardHover = {
    rest: { y: 0, scale: 1 },
    hover: {
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
    }
};

export const iconFloat = {
    animate: {
        y: [0, -5, 0],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

"use client";
import { motion as motion, useReducedMotion as useReducedMotion } from "framer-motion";
export default function Template({ children }: {
    children: React.ReactNode;
}) {
    const reduced = useReducedMotion();
    return (<motion.div initial={reduced ? false : { opacity: 0.8, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
      {children}
    </motion.div>);
}

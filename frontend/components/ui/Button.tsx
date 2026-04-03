"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "medical" | "glass";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    const variants = {
      primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-xl dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200",
      secondary: "bg-medical-secondary/10 text-medical-secondary hover:bg-medical-secondary/20 border border-medical-secondary/20",
      outline: "border-2 border-slate-200 dark:border-white/10 bg-transparent hover:bg-slate-50 dark:hover:bg-white/5 text-slate-900 dark:text-white",
      ghost: "hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-transparent",
      medical: "medical-gradient-bg text-white shadow-[0_10px_30px_-10px_rgba(0,102,204,0.5)] hover:shadow-[0_15px_35px_-10px_rgba(0,102,204,0.6)] hover:scale-[1.02] active:scale-[0.98]",
      glass: "glass-dark text-white hover:bg-white/10 border-white/10",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs font-black uppercase tracking-tighter",
      md: "h-11 px-6 text-sm font-bold tracking-tight",
      lg: "h-14 px-8 text-base font-black",
      xl: "h-16 px-10 text-lg font-black tracking-tight",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.97 }}
        className={cn(
          "inline-flex items-center justify-center rounded-2xl transition-all disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mr-2 h-4 w-4 rounded-full border-2 border-current border-t-transparent" 
          />
        ) : null}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </motion.button>
    );
  }
);

Button.displayName = "Button";

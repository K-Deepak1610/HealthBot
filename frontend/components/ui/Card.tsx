"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "outline" | "surface";
  hover?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", hover = true, children, ...props }, ref) => {
    const variants = {
      default: "medical-surface",
      surface: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-xl",
      glass: "medical-glass",
      outline: "bg-transparent border-2 border-slate-200 dark:border-white/10 hover:border-medical-primary/50 transition-colors",
    };

    const { 
      onDrag, onDragStart, onDragEnd, onAnimationStart, 
      // @ts-ignore
      onDragTransitionEnd, 
      ...rest 
    } = props;

    return (
      <motion.div
        ref={ref}
        whileHover={hover ? { y: -5, scale: 1.01, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } : {}}
        className={cn(
          "rounded-[2.5rem] p-8 relative overflow-hidden",
          variants[variant],
          className
        )}
        {...rest}
      >
        {variant === "glass" && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-medical-primary/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
        )}
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 p-0 mb-6", className)} {...props} />
);

export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn("text-2xl font-black leading-none tracking-tight text-slate-900 dark:text-white", className)} {...props} />
);

export const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm font-medium text-slate-500 dark:text-slate-400 mt-2", className)} {...props} />
);

export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-0 relative z-10", className)} {...props} />
);

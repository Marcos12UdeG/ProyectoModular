import React, { ButtonHTMLAttributes, ReactNode } from "react";
import cn from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "secondary" | "ghost";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "default",
  className,
  ...props
}) => {
  const sizeClass = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }[size];

  const variantClass = {
    default: "bg-primary text-white hover:bg-primary-dark",
    secondary: "bg-secondary text-white hover:bg-secondary-dark",
    ghost: "bg-transparent text-foreground hover:bg-gray-100",
  }[variant];

  return (
    <button
      className={cn(
        "rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
        sizeClass,
        variantClass,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

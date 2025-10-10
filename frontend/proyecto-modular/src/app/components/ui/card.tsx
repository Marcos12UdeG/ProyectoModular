import React, { HTMLAttributes, ReactNode } from "react";
import cn from "clsx";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-md p-6 transition-shadow hover:shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

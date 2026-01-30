import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold';
    size?: 'sm' | 'md' | 'lg';
    icon?: LucideIcon;
    loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', icon: Icon, loading, children, ...props }, ref) => {
        const variants = {
            primary: 'bg-burgundy-800 text-white hover:bg-burgundy-950 shadow-md hover:shadow-lg',
            secondary: 'bg-burgundy-100 text-burgundy-900 hover:bg-burgundy-200',
            outline: 'bg-transparent border border-burgundy-200 text-burgundy-900 hover:bg-burgundy-50',
            ghost: 'bg-transparent text-gray-600 hover:bg-gray-50',
            gold: 'bg-gold-500 text-burgundy-950 hover:bg-gold-600 shadow-md',
        };

        const sizes = {
            sm: 'px-4 py-1.5 text-xs',
            md: 'px-6 py-2.5 text-sm',
            lg: 'px-8 py-3.5 text-base',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider',
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={loading}
                {...props}
            >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : Icon ? (
                    <Icon className="mr-2" size={variants[variant].includes('sm') ? 16 : 18} />
                ) : null}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;

import { cva } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
	'inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
	{
		variants: {
			variant: {
				primary: 'bg-slate-900 text-white hover:bg-slate-800',
				outline: 'border border-slate-200 bg-white hover:bg-slate-100 text-slate-900',
				ghost: 'hover:bg-slate-100 text-slate-900',
			},
			size: {
				sm: 'h-9 px-3 text-xs',
				md: 'h-10 px-4 py-2',
				lg: 'h-11 px-8 text-base',
			},
			shape: {
				default: 'rounded-md',
				pill: 'rounded-[31px]',
			},
		},
		defaultVariants: {
			variant: 'primary',
			size: 'md',
			shape: 'default',
		},
	},
);

export function Button({
	className,
	variant,
	size,
	shape,
	type = 'button',
	disabled,
	onClick,
	children,
	id,
	name,
	value,
	...props
}) {
	return (
		<button
			className={cn(buttonVariants({ variant, size, shape, className }))}
			type={type}
			disabled={disabled}
			onClick={onClick}
			id={id}
			name={name}
			value={value}
			{...props}>
			{children}
		</button>
	);
}

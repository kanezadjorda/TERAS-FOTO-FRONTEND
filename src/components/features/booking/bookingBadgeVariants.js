import { cva } from 'class-variance-authority';

export const statusBadgeVariants = cva(
	'px-4 py-2 text-[14px] font-inter font-medium rounded-[37.5px]',
	{
		variants: {
			status: {
				confirmed: 'bg-[#E8F5E9] text-[#2E7D32]',
				canceled: 'bg-[#FFEBEE] text-[#C62828]',
				pending_payment: 'bg-[#FFF8E1] text-[#F57F17]',
				completed: 'bg-[#E3F2FD] text-[#1565C0]',
				default: 'bg-[#F5F5F5] text-[#616161]',
			},
		},
		defaultVariants: {
			status: 'default',
		},
	},
);

export const paymentBadgeVariants = cva(
	'px-4 py-2 text-[14px] font-inter font-medium rounded-[37.5px]',
	{
		variants: {
			status: {
				paid: 'bg-[#E8F5E9] text-[#2E7D32]',
				dp: 'bg-[#E3F2FD] text-[#1565C0]',
				unpaid: 'bg-[#FFEBEE] text-[#C62828]',
				refunded: 'bg-[#F3E5F5] text-[#6A1B9A]',
				default: 'bg-[#F5F5F5] text-[#616161]',
			},
		},
		defaultVariants: {
			status: 'default',
		},
	},
);

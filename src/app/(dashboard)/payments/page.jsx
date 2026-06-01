import PaymentsClient from './PaymentsClient';

export const metadata = {
	title: 'Billing & Payments - Teras Foto Studio',
	description:
		'Manage your session invoices, track your studio spend, and review your payment history.',
};

export default function PaymentsPage() {
	return <PaymentsClient />;
}

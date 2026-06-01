import { Poppins, Epilogue } from 'next/font/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { cn } from '@/utils/cn';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

const poppins = Poppins({
	variable: '--font-poppins',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
});

const epilogue = Epilogue({
	variable: '--font-epilogue',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700', '800'],
});

export const metadata = {
	title: 'Teras Foto Studio',
	description:
		'Tingkatkan penceritaan visual Anda di ruang premium kami yang dirancang dengan cermat. Hasil profesional dengan suasana santai dan nyaman.',
};

export default function RootLayout({ children }) {
	return (
		<html lang="en" className={cn(poppins.variable, epilogue.variable, 'h-full antialiased')}>
			<body className="min-h-full flex flex-col">
				<GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
					<AuthProvider>{children}</AuthProvider>
				</GoogleOAuthProvider>
			</body>
		</html>
	);
}

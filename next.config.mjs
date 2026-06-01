/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '*.public.blob.vercel-storage.com', // Mengizinkan semua gambar dari Vercel Blob
				port: '',
			},
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
			},
		],
	},
};

export default nextConfig;

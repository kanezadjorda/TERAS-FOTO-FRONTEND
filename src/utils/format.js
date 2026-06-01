/**
 * Formats a number into Indonesian Rupiah (IDR) currency format.
 * @param {number} number - The number to format.
 * @returns {string} The formatted currency string (e.g., Rp 1.500.000).
 */
export function formatRupiah(number) {
	if (number === null || number === undefined || isNaN(number)) {
		return 'Rp 0';
	}
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(number);
}

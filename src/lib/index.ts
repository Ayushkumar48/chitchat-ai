export function convertTo12HourFormat(time24: string): string {
	const [hours, minutes] = time24.split(':').map(Number);
	return new Date(0, 0, 0, hours, minutes).toLocaleTimeString('en-US', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: true
	});
}

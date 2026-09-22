export function jsonColumn<T>() {
	return {
		prepare: (value: T | null) => (value === null ? null : JSON.stringify(value)),
		consume: (value: T | null) => value,
	};
}

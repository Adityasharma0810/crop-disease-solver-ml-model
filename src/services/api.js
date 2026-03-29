(function getBackend2BaseUrl() {
	// Use environment variable if available, else fallback to localhost
	return (
		import.meta.env.VITE_BACKEND2_URL ||
		process.env.REACT_APP_BACKEND2_URL ||
		"http://127.0.0.1:8000"
	);
})

export const BACKEND2_BASE_URL = (typeof getBackend2BaseUrl === 'function') ? getBackend2BaseUrl() : "http://127.0.0.1:8000";

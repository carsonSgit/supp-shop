/**
 * API Configuration
 * Centralizes API base URL from environment variables
 */

const getApiUrl = () => {
	// Create React App uses process.env.REACT_APP_*
	if (process.env.REACT_APP_API_URL) {
		return process.env.REACT_APP_API_URL;
	}
	
	// Default to localhost for development
	return 'http://localhost:1339';
};

export const API_BASE_URL = getApiUrl();


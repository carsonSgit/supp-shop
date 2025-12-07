// npx jest src/tests/workoutMongoDb.test.js --runInBand

/** @type {import('jest').Config} */
module.exports = {
	testEnvironment: "node",
	roots: ["<rootDir>/src"],
	setupFiles: ["<rootDir>/src/jest.config.ts"],
	transform: {
		"^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.json" }],
	},
	testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|tsx|js)$",
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	transformIgnorePatterns: ["<rootDir>/node_modules/"],
	clearMocks: true,
};


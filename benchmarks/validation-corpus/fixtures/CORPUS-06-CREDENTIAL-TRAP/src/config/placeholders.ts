// Dummy configuration placeholders
// True Negatives: Known placeholders, mock keys, test keys that must NOT trigger false positives

// AWS placeholder key (must be suppressed by isPlaceholderValue)
export const MOCK_AWS_KEY = "AKIAEXAMPLEKEY123456";

// Stripe test key (sk_test_ is non-live and must NOT match sk_live_ signature)
export const MOCK_STRIPE_KEY = "sk_test_51M0abcdefghijklmnopqrstuvwxyz123456";

// GitHub placeholder token (must be suppressed by isPlaceholderValue)
export const MOCK_GITHUB_TOKEN = "ghp_your_token_here_dummy_replace_123456789";

// Generic dummy secret
export const GENERIC_SECRET = "your_secret_here";

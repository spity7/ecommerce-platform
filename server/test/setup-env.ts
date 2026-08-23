/**
 * Test environment — import this file before any server modules.
 * Uses an isolated DB (never the dev DB unless MONGODB_URI_TEST is set).
 */
const defaultTestUri = "mongodb://127.0.0.1:27017/ecommerce-platform-test";

process.env.NODE_ENV = "development";
process.env.SITE_ID = "beauty-station";
process.env.MONGODB_URI = process.env.MONGODB_URI_TEST ?? defaultTestUri;
process.env.CORS_ORIGINS = "http://localhost:3000,http://localhost:3001";
process.env.JWT_ACCESS_SECRET = "test-access-secret-min16chars";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret-min16chars";
process.env.JWT_ACCESS_EXPIRES_IN = "15m";
process.env.JWT_REFRESH_EXPIRES_IN = "7d";

delete process.env.SMTP_HOST;
delete process.env.SMTP_USER;
delete process.env.SMTP_PASS;
delete process.env.EMAIL_FROM;

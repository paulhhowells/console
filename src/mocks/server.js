import { setupServer } from 'msw/node';
import { handlers } from './handlers.js';

// This configures a request interception layer for Node.js (used in tests)
export const server = setupServer(...handlers);

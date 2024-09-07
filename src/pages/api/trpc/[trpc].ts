// src/pages/api/trpc/[trpc].ts
import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter } from '../../../server/router'; // Adjust path as needed
import { createContext } from '../../../server/context'; // Adjust path as needed

export default createNextApiHandler({
  router: appRouter,
  createContext,
});

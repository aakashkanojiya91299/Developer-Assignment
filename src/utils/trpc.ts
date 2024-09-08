
import { createTRPCNext } from '@trpc/next';
import { AppRouter } from '../server/router';
import { NextPageContext } from 'next';
import { loggerLink, unstable_httpBatchStreamLink } from '@trpc/client';


export interface SSRContext extends NextPageContext {
    status?: number;
  }

export const trpc = createTRPCNext<AppRouter, SSRContext>({
    config({ ctx }) {
      return {
        links: [
          
          loggerLink({
            enabled: (opts) =>
              process.env.NODE_ENV === 'development' ||
              (opts.direction === 'down' && opts.result instanceof Error),
          }),
          unstable_httpBatchStreamLink({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/trpc`,
           
            headers() {
              if (!ctx?.req?.headers) {
                return {};
              }            
              const {
                ...headers
              } = ctx.req.headers;
              return headers;
            },
            
          }),
        ],
      };
    },
    ssr: false,
  });



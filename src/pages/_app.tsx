import type { NextPage } from 'next';
import type { AppType, AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';
import '@/styles/globals.css';

import { trpc } from '../utils/trpc';
import { AuthProvider } from '@/Context';

export type NextPageWithLayout<
  TProps = Record<string, unknown>,
  TInitialProps = TProps,
> = NextPage<TProps, TInitialProps> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = (({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout =
    Component.getLayout ?? ((page) => <>{page}</>);

  return getLayout(<AuthProvider>
    <Component {...pageProps} />
  </AuthProvider>
  );
}) as AppType;

export default trpc.withTRPC(MyApp);

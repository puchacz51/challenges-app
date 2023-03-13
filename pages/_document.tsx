import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head />
      <meta name='viewport' content='width=device-width, user-scalable=no' />
      <body className=' min-h-screen'>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

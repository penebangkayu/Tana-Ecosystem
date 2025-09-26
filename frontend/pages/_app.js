// pages/_app.js
import '../styles/global.css'; // pastikan path sesuai
import React from 'react';

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

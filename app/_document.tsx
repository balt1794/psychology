import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta name="google-adsense-account" content="ca-pub-4734978183379672"/>
          <meta
            name="description"
            content="Fast and Efficient Listings using AI"
          />
          <meta property="og:site_name" content="propertylistingsai.com" />
          <meta
            property="og:description"
            content="Fast and Efficient Listings using AI"
          />
          <meta property="og:title" content="Property Listings AI Generator" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Property Listings AI Generator" />
          <meta
            name="twitter:description"
            content="Fast and Efficient Listings using AI"
          />
          <meta
            property="og:image"
            content="https://propertylistingsai.com/featured.png"
          />
          <meta
            name="twitter:image"
            content="https://propertylistingsai.com/featured.png"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
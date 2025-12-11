import { store } from "@/config/redux/store";
import "@/styles/globals.css";
import { Provider } from "react-redux";
import Head from "next/head";


export default function App({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
        <Head>
          
        </Head>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

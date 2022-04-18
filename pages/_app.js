import { RecoilRoot } from 'recoil';
import Head from 'next/head';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
	return (
		<RecoilRoot>
			<Head>
				<title>Spot Mapper</title>
			</Head>
			<Component {...pageProps} />
		</RecoilRoot>
	);
}

export default MyApp;

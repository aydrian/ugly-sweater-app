import { ChakraProvider } from "@chakra-ui/react";

function Application({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default Application;

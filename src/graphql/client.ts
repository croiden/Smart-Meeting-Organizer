import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  concat,
} from "@apollo/client";

const TOKEN = "2662973537a9db59a399b1b53d7810c6fd0654b7";
const httpLink = new HttpLink({ uri: "https://smart-meeting.herokuapp.com" });

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      token: TOKEN,
    },
  }));

  return forward(operation);
});

export default new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
});

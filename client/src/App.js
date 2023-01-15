import Header from "./components/Header";
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import Clients from "./components/Clients";
import AddClientModal from "./components/addClientModal";

//remove warning for cache data refetch - Not working?
const cache = new InMemoryCache({
  typePolicies: {
    query: {
      fields: {
        clients: {
          merge(existing, incoming) {
            return incoming;
          }
        },
        projects: {
          merge(existing, incoming) {
            return incoming;
          }
        }
      }
    }
  }
});

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql', 
  cache,
});

function App() {
  return (
    <>
    <ApolloProvider client={client}>
    <Header />
    <div className="container">
      <AddClientModal />
      <Clients /> 
    </div>
    </ApolloProvider>
    </>
  );
}

export default App;

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from "./components/Header";
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import Home from './pages/Home';
import Project from './pages/Project';
import NotFound from './pages/NotFound';

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
    <Router>
      <Header />
      <div className="container">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/projects/:id" element={<Project />}></Route>
          <Route path="*" element={<NotFound /> }></Route>
        </Routes>
      </div>
      </Router>
    </ApolloProvider>
    </>
  );
}

export default App;

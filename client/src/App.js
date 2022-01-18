import logo from './logo.svg';
import './App.css';

import { gql, useQuery } from '@apollo/client';
import Persons from './components/Persons';

const ALL_PERSONS = gql`
  query {
    allPersons {
      name
      phone
      id
    }
  }
`;



const App = () => {
  const result = useQuery(ALL_PERSONS);
  if (result.loading) {
    return <div>loading...</div>;
  }
  return (
    <div className='App'>
      <header className='App-header'>
        <Persons persons={result.data.allPersons}/>
      </header>
    </div>
  );
};

export default App;

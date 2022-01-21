import './App.css';

import { useQuery } from '@apollo/client';
import Persons from './components/Persons';
import PersonForm from './components/PersonForm';
import React from 'react';
import { ALL_PERSONS } from './queries';





const App = () => {
  const result = useQuery(ALL_PERSONS);

  if (result.loading) {
    return <div>loading...</div>;
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <Persons persons={result.data.allPersons} />
        <PersonForm />
      </header>
    </div>
  );
};

export default App;

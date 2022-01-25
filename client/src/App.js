import { useQuery } from '@apollo/client';
import Persons from './components/Persons';
import PersonForm from './components/PersonForm';
import React, { useCallback, useState } from 'react';
import { ALL_PERSONS } from './queries';

import './App.css';
import PhoneForm from './components/PhoneForm';

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);

  const result = useQuery(ALL_PERSONS);

  const notify = useCallback((message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  }, []);

  if (result.loading) {
    return <div>loading...</div>;
  }

  return (
    <div className='App'>
      <Notify errorMessage={errorMessage} />
      <header className='App-header'>
        <Persons persons={result.data.allPersons} />
        <PersonForm setError={notify} />
        <PhoneForm setError={notify} />
      </header>
    </div>
  );
};

const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null;
  }
  return <div style={{ color: 'red' }}>{errorMessage}</div>;
};

export default App;

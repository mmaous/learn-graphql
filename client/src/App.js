import { useApolloClient, useQuery } from '@apollo/client';
import Persons from './components/Persons';
import PersonForm from './components/PersonForm';
import React, { useCallback, useState } from 'react';
import { ALL_PERSONS } from './queries';

import './App.css';
import PhoneForm from './components/PhoneForm';
import LoginForm from './components/LoginForm';

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem('phonenumbers-user-token'),
  );
  const result = useQuery(ALL_PERSONS);
  const { resetStore } = useApolloClient();
  

  const notify = useCallback((message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  }, []);

  if (result.loading) {
    return <div>loading...</div>;
  }

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <h2>Login</h2>
        <LoginForm setToken={setToken} setError={notify} />
      </div>
    );
  }

  const logout = () => {
    setToken(null);
    localStorage.clear();
    resetStore(); //  reset the cache

  };
  return (
    <div className='App'>
      <Notify errorMessage={errorMessage} />
      <header className='App-header'>
        <nav>
          <div>
            <button onClick={logout}>logout</button>
          </div>
        </nav>
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

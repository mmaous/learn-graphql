import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { ALL_PERSONS, CREATE_PERSON } from '../queries';


const PersonForm = ({ setError }) => {
  const [name, setName] = useState('Jim');
  const [phone, setPhone] = useState('3242-445-422');
  const [street, setStreet] = useState('21 st Gzrfield ');
  const [city, setCity] = useState('New York');

  const [ createPerson ] = useMutation(CREATE_PERSON, {
    refetchQueries: [{ query: ALL_PERSONS }],
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    }
  });
  const submit =  (event) => {
    event.preventDefault();

    createPerson({ variables: { name, phone, city, street } })
    setName('');
    setPhone('');
    setStreet('');
    setCity('');
  };
  
 

  return (
    <div>
      <form onSubmit={submit}>
        <h2>Add Person :</h2>
        <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          phone
          <input
            value={phone}
            onChange={({ target }) => setPhone(target.value)}
          />
        </div>
        <div>
          street
          <input
            value={street}
            onChange={({ target }) => setStreet(target.value)}
          />
        </div>
        <div>
          city
          <input
            value={city}
            onChange={({ target }) => setCity(target.value)}
          />
        </div>
        <button type='submit'>add!</button>
      </form>
    </div>
  );
};

export default PersonForm;

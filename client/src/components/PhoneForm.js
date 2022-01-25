import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { EDIT_NUMBER } from '../queries';

const PhoneForm = ({ setError }) => {
  const [name, setName] = useState('Arto Hellas');
  const [phone, setPhone] = useState('113-555-6432');

  const [changeNumber, result ] = useMutation(EDIT_NUMBER, {
    onError: (error) => setError(error.graphQLErrors[0].message)
  });

  useEffect(() => {
    if (result.data && result.data.editNumber === null) {
      setError('Person not found')
    }
  }, [result.data, setError]);

  const submit = (event) => {
    event.preventDefault();

    changeNumber({ variables: { name, phone } });

    setName('');
    setPhone('');
  };

  return (
    <div>
      <h2>Change Number: </h2>
      <form onSubmit={submit}>
        <div>
          Name:
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          New Phone:
          <input
            value={phone}
            onChange={({ target }) => setPhone(target.value)}
          />
        </div>
        <button type='submit'>Update Number</button>
      </form>
    </div>
  );
};

export default PhoneForm;

'use client';

import { useState } from 'react';

export default function CreateLabel() {
  const [fromZip, setFromZip] = useState('');
  const [toZip, setToZip] = useState('');
  const [weight, setWeight] = useState('');

  return (
    <>
      <h1>Create Shipping Label</h1>
      <form onSubmit={(e) => e.preventDefault()} style={{ display: 'grid', gap: '1rem', maxWidth: '400px' }}>
        <label>
          From ZIP:
          <input type="text" value={fromZip} onChange={(e) => setFromZip(e.target.value)} />
        </label>
        <label>
          To ZIP:
          <input type="text" value={toZip} onChange={(e) => setToZip(e.target.value)} />
        </label>
        <label>
          Weight (oz):
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
        </label>
        <button type="submit">Get Label Quote</button>
      </form>
    </>
  );
}
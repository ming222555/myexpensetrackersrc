import React from 'react';
import { useLoaderData } from 'react-router-dom';

// import { queryClient } from '../index'; // to use in loader

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const loader = async () => {
  const d = Math.trunc(Math.random() * 10000000) % 2;
  if (d > 0) {
    throw new Response('Not Found qwertypopo', { status: 404 });
  }
  return 123;
};

export default function Popo(): JSX.Element {
  const dd = useLoaderData() as number;

  return <p>Me popo res {dd}</p>;
}

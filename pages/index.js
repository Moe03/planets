import Head from 'next/head'
import Link from 'next/link';
import React, {useState} from 'react';

export default function Index(props) {

  return (
    <div>
      <Head>
        <title>Planets 3D</title>
        <meta name="description" content="Planets showcased in a 3D scene, show how large or small other planets are relative to earth." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='overflow-x-hidden text-lg md:text-xl'>
        {props.canvas}
      </main>
    </div>
  )
}

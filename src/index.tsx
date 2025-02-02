import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import './test.css';

const appEl = document.querySelector('#app')!;

const root = createRoot(appEl);
root.render(<App />);

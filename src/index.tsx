import React from 'react';
import { createRoot } from 'react-dom/client';
import 'normalize.css';
import { App } from './app';

const appEl = document.querySelector('#app')!;

const root = createRoot(appEl);
root.render(<App />);

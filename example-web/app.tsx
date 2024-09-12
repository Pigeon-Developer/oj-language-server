import React from 'react';
import ReactDOM from 'react-dom/client';
import Editor from './editor';

const rootEle = document.createElement('div');

document.body.appendChild(rootEle);

const root = ReactDOM.createRoot(rootEle);
root.render(<Editor />);

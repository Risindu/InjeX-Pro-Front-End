// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBiXr6IBegL6uyaqgydvQgycuugybUT0mk',
  authDomain: 'injex-pro-hub.firebaseapp.com',
  projectId: 'injex-pro-hub',
  storageBucket: 'injex-pro-hub.appspot.com',
  messagingSenderId: '5072978533',
  appId: '1:5072978533:web:efa3d33d437e045211fc8c',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

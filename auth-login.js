// debug-auth-login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB7GvjF785yTKIF3JMXeDYMVeiV7rTRx5A",
  authDomain: "patro-de-farciennes-api.firebaseapp.com",
  projectId: "patro-de-farciennes-api",
  storageBucket: "patro-de-farciennes-api.firebasestorage.app",
  messagingSenderId: "105134143434",
  appId: "1:105134143434:web:bfc765580e15af7e2c8133",
  measurementId: "G-VDGKSG9JRJ"
};

console.log('debug-auth-login.js chargé');

try {
  initializeApp(firebaseConfig);
  console.log('Firebase initialisé');
} catch (err) {
  console.error('Erreur initializeApp', err);
}

const auth = getAuth();

window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM ready');
  const btn = document.getElementById('login-btn');
  const msg = document.getElementById('login-msg');
  console.log('btn trouvé ?', !!btn, 'msg trouvé ?', !!msg);

  if (!btn) { console.error('Bouton login introuvable'); return; }

  btn.addEventListener('click', async () => {
    console.log('click login déclenché');
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-pass').value;
    console.log('email', email ? '[ok]' : '[vide]', 'pass length', pass.length);
    if (!email || !pass) { msg.style.color = 'red'; msg.textContent = 'Email et mot de passe requis.'; return; }
    try {
      const user = await signInWithEmailAndPassword(auth, email, pass);
      console.log('signIn success', user);
      msg.style.color = 'green';
      msg.textContent = 'Connecté. Redirection...';
    } catch (e) {
      console.error('Erreur signIn:', e);
      msg.style.color = 'red';
      msg.textContent = 'Erreur connexion : ' + (e.message || e.code);
    }
  });
});

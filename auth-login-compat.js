// auth-login-compat.js (non-module, compat API)
(function () {
  // Ta config Firebase (déjà fournie)
  const firebaseConfig = {
    apiKey: "AIzaSyB7GvjF785yTKIF3JMXeDYMVeiV7rTRx5A",
    authDomain: "patro-de-farciennes-api.firebaseapp.com",
    projectId: "patro-de-farciennes-api",
    storageBucket: "patro-de-farciennes-api.firebasestorage.app",
    messagingSenderId: "105134143434",
    appId: "1:105134143434:web:bfc765580e15af7e2c8133",
    measurementId: "G-VDGKSG9JRJ"
  };

  // Eviter double initialisation
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialisé (compat).');
  } else {
    console.log('Firebase déjà initialisé.');
  }

  const auth = firebase.auth();

  // DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('login-btn');
    const msg = document.getElementById('login-msg');

    if (!btn) {
      console.error('Bouton login introuvable (id=login-btn)');
      return;
    }

    btn.addEventListener('click', function () {
      msg.textContent = '';
      const email = (document.getElementById('login-email') || {}).value || '';
      const pass = (document.getElementById('login-pass') || {}).value || '';

      if (!email.trim() || !pass) {
        msg.style.color = 'red';
        msg.textContent = 'Email et mot de passe requis.';
        return;
      }

      auth.signInWithEmailAndPassword(email.trim(), pass)
        .then(function (userCredential) {
          console.log('Connexion réussie', userCredential);
          msg.style.color = 'green';
          msg.textContent = 'Connecté. Redirection...';
          // window.location.href = '/dashboard.html'; // décommenter si tu veux rediriger
        })
        .catch(function (error) {
          console.error('Erreur signIn:', error);
          msg.style.color = 'red';
          if (error.code === 'auth/user-not-found') msg.textContent = 'Aucun compte pour cet e‑mail.';
          else if (error.code === 'auth/wrong-password') msg.textContent = 'Mot de passe incorrect.';
          else msg.textContent = 'Erreur connexion : ' + (error.message || error.code);
        });
    });

    const showForgot = document.getElementById('show-forgot');
    if (showForgot) {
      showForgot.addEventListener('click', function (ev) {
        ev.preventDefault();
        document.getElementById('forgot-block').style.display = 'block';
      });
    }

    const fpSend = document.getElementById('fp-send');
    if (fpSend) {
      fpSend.addEventListener('click', function () {
        const email = (document.getElementById('fp-email') || {}).value || '';
        const ui = document.getElementById('fp-msg');
        ui.textContent = '';
        if (!email.trim()) { ui.style.color = 'red'; ui.textContent = 'Veuillez saisir une adresse e‑mail.'; return; }

        // actionCodeSettings : redirection après reset (doit être sur domaine autorisé)
        const actionCodeSettings = {
          url: window.location.origin + '/reset-password.html',
          handleCodeInApp: false
        };

        auth.sendPasswordResetEmail(email.trim(), actionCodeSettings)
          .then(function () {
            ui.style.color = 'green';
            ui.textContent = 'E‑mail envoyé. Vérifiez votre boîte mail.';
          })
          .catch(function (err) {
            console.error('Erreur reset:', err);
            ui.style.color = 'red';
            if (err.code === 'auth/user-not-found') ui.textContent = 'Aucun compte trouvé pour cet e‑mail.';
            else if (err.code === 'auth/unauthorized-continue-uri') ui.textContent = 'Domaine non autorisé. Ajoute ton domaine dans Firebase Auth.';
            else ui.textContent = 'Erreur : ' + (err.message || err.code);
          });
      });
    }
  });
})();

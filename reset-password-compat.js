// reset-password-compat.js (non-module)
(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyB7GvjF785yTKIF3JMXeDYMVeiV7rTRx5A",
    authDomain: "patro-de-farciennes-api.firebaseapp.com",
    projectId: "patro-de-farciennes-api",
    storageBucket: "patro-de-farciennes-api.firebasestorage.app",
    messagingSenderId: "105134143434",
    appId: "1:105134143434:web:bfc765580e15af7e2c8133",
    measurementId: "G-VDGKSG9JRJ"
  };

  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();

  function getQueryParam(name) { return new URL(window.location.href).searchParams.get(name); }

  function initResetPage() {
    const oobCode = getQueryParam('oobCode');
    const infoEl = document.getElementById('reset-info');
    const msgEl = document.getElementById('reset-msg');
    if (!oobCode) { if (infoEl) infoEl.textContent = 'Lien invalide. Demandez un nouveau lien.'; return; }

    auth.verifyPasswordResetCode(oobCode)
      .then(function (email) {
        if (infoEl) infoEl.textContent = 'Réinitialisation pour : ' + email;
      })
      .catch(function (err) {
        console.error('verifyPasswordResetCode:', err);
        if (infoEl) infoEl.textContent = 'Le lien est invalide ou expiré. Demandez un nouveau lien.';
      });

    const submit = document.getElementById('reset-submit');
    if (!submit) { console.error('Bouton reset introuvable (id=reset-submit)'); return; }

    submit.addEventListener('click', function () {
      const p1 = (document.getElementById('new-pass') || {}).value || '';
      const p2 = (document.getElementById('new-pass2') || {}).value || '';
      if (!p1 || !p2) { msgEl.style.color = 'red'; msgEl.textContent = 'Remplissez les deux champs.'; return; }
      if (p1 !== p2) { msgEl.style.color = 'red'; msgEl.textContent = 'Les mots de passe ne correspondent pas.'; return; }
      if (p1.length < 6) { msgEl.style.color = 'red'; msgEl.textContent = 'Le mot de passe doit contenir au moins 6 caractères.'; return; }

      auth.confirmPasswordReset(oobCode, p1)
        .then(function () {
          msgEl.style.color = 'green';
          msgEl.textContent = 'Mot de passe modifié. Vous pouvez maintenant vous connecter.';
          setTimeout(function () { window.location.href = '/index.html'; }, 2000);
        })
        .catch(function (err) {
          console.error('confirmPasswordReset:', err);
          msgEl.style.color = 'red';
          msgEl.textContent = 'Erreur : ' + (err.message || err.code);
        });
    });
  }

  window.addEventListener('DOMContentLoaded', initResetPage);
})();

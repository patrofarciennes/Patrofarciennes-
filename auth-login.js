// auth-login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB7GvjF785yTKIF3JMXeDYMVeiV7rTRx5A",
  authDomain: "patro-de-farciennes-api.firebaseapp.com",
  projectId: "patro-de-farciennes-api",
  storageBucket: "patro-de-farciennes-api.firebasestorage.app",
  messagingSenderId: "105134143434",
  appId: "1:105134143434:web:bfc765580e15af7e2c8133",
  measurementId: "G-VDGKSG9JRJ"
};

if (!firebaseConfig.apiKey) {
  document.addEventListener("DOMContentLoaded", () => {
    const msg = document.getElementById("login-msg");
    if (msg) { msg.style.color = "red"; msg.textContent = "Firebase non configuré."; }
  });
  console.error("Firebase config manquante dans auth-login.js");
} else {
  initializeApp(firebaseConfig);
  const auth = getAuth();

  window.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("login-btn");
    const msg = document.getElementById("login-msg");
    if (!btn) { console.error("Bouton login introuvable (id=login-btn)"); return; }

    btn.addEventListener("click", async () => {
      msg.textContent = "";
      const email = document.getElementById("login-email").value.trim();
      const pass = document.getElementById("login-pass").value;
      if (!email || !pass) { msg.style.color = "red"; msg.textContent = "Email et mot de passe requis."; return; }
      try {
        await signInWithEmailAndPassword(auth, email, pass);
        msg.style.color = "green";
        msg.textContent = "Connecté. Redirection...";
      } catch (e) {
        console.error("Erreur signIn:", e);
        msg.style.color = "red";
        if (e.code === "auth/user-not-found") msg.textContent = "Aucun compte pour cet e‑mail.";
        else if (e.code === "auth/wrong-password") msg.textContent = "Mot de passe incorrect.";
        else msg.textContent = "Erreur connexion : " + (e.message || e.code);
      }
    });

    const showForgot = document.getElementById("show-forgot");
    if (showForgot) {
      showForgot.addEventListener("click", (ev) => {
        ev.preventDefault();
        document.getElementById("forgot-block").style.display = "block";
      });
    }

    const fpSend = document.getElementById("fp-send");
    if (fpSend) {
      fpSend.addEventListener("click", async () => {
        const email = document.getElementById("fp-email").value.trim();
        const ui = document.getElementById("fp-msg");
        ui.textContent = "";
        if (!email) { ui.style.color = "red"; ui.textContent = "Veuillez saisir une adresse e‑mail."; return; }
        try {
          await sendPasswordResetEmail(auth, email, { url: window.location.origin + "/reset-password.html" });
          ui.style.color = "green";
          ui.textContent = "E‑mail envoyé. Vérifiez votre boîte mail.";
        } catch (err) {
          console.error("Erreur reset:", err);
          ui.style.color = "red";
          if (err.code === "auth/user-not-found") ui.textContent = "Aucun compte trouvé pour cet e‑mail.";
          else if (err.code === "auth/unauthorized-continue-uri") ui.textContent = "Domaine non autorisé. Ajoute ton domaine dans Firebase Auth.";
          else ui.textContent = "Erreur : " + (err.message || err.code);
        }
      });
    }
  });
}

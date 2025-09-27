import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  OAuthProvider, 
  signInWithPopup 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 🔥 Configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDsP7lNqu-tDpJxpsyv8t1DW0M_u2EAE3o",
  authDomain: "bartolomeu-cruz.firebaseapp.com",
  databaseURL: "https://bartolomeu-cruz-default-rtdb.firebaseio.com",
  projectId: "bartolomeu-cruz",
  storageBucket: "bartolomeu-cruz.appspot.com",
  messagingSenderId: "408863884951",
  appId: "1:408863884951:web:13e8c2282139c1307dcbd2"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// 🔹 Login com E-mail e Senha
document.getElementById("btnLogin").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const uid = userCredential.user.uid;

    // Verifica se é cliente
    const snap = await get(ref(db, "usuarios/clientes/" + uid));
    if (snap.exists()) {
      alert("Login bem-sucedido como cliente!");
      window.location.href = "homeCleinte.html";
    } else {
      alert("Esta conta não pertence a um cliente.");
    }
  } catch (error) {
    alert("Erro no login: " + error.message);
  }
});

// 🔹 Login com Google
document.getElementById("btnGoogle").addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const uid = result.user.uid;

    // Verifica se já é cliente no DB
    const snap = await get(ref(db, "usuarios/clientes/" + uid));
    if (snap.exists()) {
      window.location.href = "sucesso.html";
    } else {
      alert("Conta Google não cadastrada como cliente.");
    }
  } catch (error) {
    alert("Erro no login Google: " + error.message);
  }
});

// 🔹 Login com Apple
document.getElementById("btnApple").addEventListener("click", async () => {
  const provider = new OAuthProvider("apple.com");
  try {
    const result = await signInWithPopup(auth, provider);
    const uid = result.user.uid;

    // Verifica se já é cliente no DB
    const snap = await get(ref(db, "usuarios/clientes/" + uid));
    if (snap.exists()) {
      window.location.href = "sucesso.html";
    } else {
      alert("Conta Apple não cadastrada como cliente.");
    }
  } catch (error) {
    alert("Erro no login Apple: " + error.message);
  }
});

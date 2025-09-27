import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

document.getElementById("cadastraCliente").addEventListener("click", async () => {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const dataNascimento = document.getElementById("dataNascimento").value;
  const telefone = document.getElementById("telefone").value;
  const senha = document.getElementById("senha").value;
  const confirmaSenha = document.getElementById("confirmaSenha").value;

  if (senha !== confirmaSenha) {
    alert("As senhas não coincidem!");
    return;
  }

  try {
    // Cria conta no Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    // Salva dados no Realtime Database
    await set(ref(db, "usuarios/clientes/" + user.uid), {
      nome: nome,
      email: email,
      dataNascimento: dataNascimento,
      telefone: telefone,
      tipo: "cliente"
    });

    alert("Conta criada com sucesso!");
    window.location.href = "homeCleinte.html"; // redireciona após cadastro
  } catch (error) {
    alert("Erro: " + error.message);
  }
});

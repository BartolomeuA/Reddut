import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  OAuthProvider, 
  signInWithRedirect, 
  getRedirectResult 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getDatabase, ref, get, set } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

// Configuração Firebase
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
const database = getDatabase(app);

// Seleciona elementos do formulário
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const btnLogin = document.getElementById('btnLogin');
const btnGoogle = document.getElementById('btnGoogle');
const btnApple = document.getElementById('btnApple');

// --- Login com E-mail/Senha ---
btnLogin.addEventListener('click', () => {
  const email = emailInput.value.trim();
  const senha = senhaInput.value;

  if (!email || !senha) {
    alert('Preencha e-mail e senha!');
    return;
  }

  signInWithEmailAndPassword(auth, email, senha)
    .then((userCredential) => {
      const user = userCredential.user;
      window.location.href = "postsVendedores.html";
    })
    .catch((error) => alert(error.message));
});

// --- Login com Google ---
btnGoogle.addEventListener('click', () => {
  const provider = new GoogleAuthProvider();
  signInWithRedirect(auth, provider);
});

// --- Login com Apple ---
btnApple.addEventListener('click', () => {
  const provider = new OAuthProvider('apple.com');
  signInWithRedirect(auth, provider);
});

// --- Processa resultado de redirect ---
getRedirectResult(auth)
  .then((result) => {
    if (result) {
      const user = result.user;
      const uid = user.uid;

      // Verifica se o usuário existe no Realtime Database
      get(ref(database, 'vendedores/' + uid))
        .then((snapshot) => {
          if (!snapshot.exists()) {
            // Se não existe, cria o registro
            set(ref(database, 'vendedores/' + uid), {
              nome: user.displayName || '',
              email: user.email,
              telefone: '',
              dataNascimento: ''
            });
          }
          // Redireciona sempre para sucesso.html
          window.location.href = "postsVendedores.html";
        })
        .catch((error) => console.error('Erro DB:', error));
    }
  })
  .catch((error) => {
    console.error('Erro login redirect:', error);
    alert(error.message);
  });

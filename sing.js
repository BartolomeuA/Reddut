// Import do Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Config Firebase
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
const nomeInput = document.getElementById('nome');
const enderecoInput = document.getElementById('endereco');
const emailInput = document.getElementById('email');
const dataInput = document.getElementById('dataNascimento');
const telefoneInput = document.getElementById('telefone');
const senhaInput = document.getElementById('senha');
const confirmaSenhaInput = document.getElementById('confirmaSenha');
const btnCadastrar = document.getElementById('Cadastra');

// Evento de cadastro
btnCadastrar.addEventListener('click', () => {
  const nome = nomeInput.value.trim();
  const endereco = enderecoInput.value.trim();
  const email = emailInput.value.trim();
  const dataNascimento = dataInput.value;
  const telefone = telefoneInput.value.trim();
  const senha = senhaInput.value;
  const confirmaSenha = confirmaSenhaInput.value;

  // Valida campos
  if (!nome || !endereco || !email || !dataNascimento || !telefone || !senha || !confirmaSenha) {
    alert('Por favor, preencha todos os campos!');
    return;
  }

  if (senha !== confirmaSenha) {
    alert('As senhas não coincidem!');
    return;
  }

  // Cria usuário no Firebase Auth
  createUserWithEmailAndPassword(auth, email, senha)
    .then((userCredential) => {
      const user = userCredential.user;
      const uid = user.uid;

      // Cria perfil no Realtime Database
      set(ref(database, 'vendedores/' + uid), {
        nome: nome,
        endereco: endereco,
        email: email,
        telefone: telefone,
        dataNascimento: dataNascimento,
        fotoPerfil: "" // deixamos vazio, depois será atualizado com upload da imagem
      })
      .then(() => {
        alert('Conta criada com sucesso!');
        // Redirecionar para a página principal do vendedor
        window.location.href = "VendedorFotos.html";
      })
      .catch((error) => {
        console.error('Erro ao salvar dados:', error);
        alert('Erro ao salvar dados no banco.');
      });

    })
    .catch((error) => {
      console.error('Erro ao criar usuário:', error);
      alert(error.message);
    });
});

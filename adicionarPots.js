import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

// Elementos do formulário
const tituloInput = document.getElementById("titulo");
const descricaoInput = document.getElementById("descricao");
const precoInput = document.getElementById("number");
const moedasSelect = document.getElementById("moedas");
const imagemInput = document.getElementById("imagem");
const button = document.getElementById("button");

// Botão de adicionar foto e preview
const btnAdicionarFoto = document.getElementById("btnAdicionarFoto");
const previewImagem = document.getElementById("previewImagem");

// 🔹 Ao clicar no botão, abre o input file
btnAdicionarFoto.addEventListener("click", () => {
  imagemInput.click();
});

// 🔹 Mostra preview da imagem selecionada
imagemInput.addEventListener("change", () => {
  const file = imagemInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImagem.src = e.target.result;
      previewImagem.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

// 🔹 Evento de submit do formulário
document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = tituloInput.value.trim();
  const descricao = descricaoInput.value.trim();
  const preco = precoInput.value;
  const moeda = moedasSelect.value;
  const file = imagemInput.files[0];

  if (!titulo || !descricao || !preco || !file) {
    alert("Por favor, preencha todos os campos e selecione uma imagem.");
    return;
  }

  // 🔹 Verifica se o usuário está logado
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      alert("Você precisa estar logado para publicar um post!");
      return;
    }

    const uid = user.uid;

    // 🔹 Converte imagem para Base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const imagemBase64 = reader.result;

      try {
        // 🔹 Cria post no Firebase Realtime Database dentro do vendedor
        await push(ref(db, `vendedores/${uid}/posts`), {
          titulo: titulo,
          descricao: descricao,
          preco: preco,
          moeda: moeda,
          imagem: imagemBase64,
          dataCriacao: new Date().toISOString()
        });

        alert("Post publicado com sucesso!");
        // 🔹 Limpa o formulário
        tituloInput.value = "";
        descricaoInput.value = "";
        precoInput.value = "";
        moedasSelect.value = "$";
        imagemInput.value = "";
        previewImagem.src = "";
        previewImagem.style.display = "none";
      } catch (error) {
        alert("Erro ao publicar post: " + error.message);
      }
    };

    reader.readAsDataURL(file); // Converte para Base64
  });
});

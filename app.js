import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDdfaXaFzeXBmJCtPbFapYfCzo6Dqm6pi4",
  authDomain: "listamercado-dedf4.firebaseapp.com",
  databaseURL: "https://listamercado-dedf4-default-rtdb.firebaseio.com",
  projectId: "listamercado-dedf4",
  storageBucket: "listamercado-dedf4.firebasestorage.app",
  messagingSenderId: "526738275454",
  appId: "1:526738275454:web:f44bbcf0cf9b7a63abec2f"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Elementos do DOM
const addItemForm = document.getElementById('add-item-form');
const itemList = document.getElementById('item-list');

// Adicionar item
addItemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const itemName = document.getElementById('item-name').value;
    try {
        await addDoc(collection(db, 'items'), {
            name: itemName
        });
        document.getElementById('item-name').value = '';
    } catch (error) {
        console.error("Erro ao adicionar documento: ", error);
    }
});

// Obter e mostrar itens
function renderItem(doc) {
    const li = document.createElement('li');
    const name = document.createElement('span');
    const editBtn = document.createElement('button');
    const deleteBtn = document.createElement('button');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    editBtn.textContent = 'Editar';
    deleteBtn.textContent = 'Deletar';

    li.appendChild(name);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    itemList.appendChild(li);

    // Deletar item
    deleteBtn.addEventListener('click', async () => {
        const id = li.getAttribute('data-id');
        try {
            await deleteDoc(doc(db, 'items', id));
        } catch (error) {
            console.error("Erro ao deletar documento: ", error);
        }
    });

    // Editar item
    editBtn.addEventListener('click', async () => {
        const newName = prompt('Novo nome:', name.textContent);
        if (newName) {
            const id = li.getAttribute('data-id');
            try {
                await updateDoc(doc(db, 'items', id), {
                    name: newName
                });
            } catch (error) {
                console.error("Erro ao atualizar documento: ", error);
            }
        }
    });
}

// Monitorar mudanças na coleção
onSnapshot(collection(db, 'items'), (snapshot) => {
    const changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type === 'added') {
            renderItem(change.doc);
        } else if (change.type === 'removed') {
            const li = itemList.querySelector(`[data-id=${change.doc.id}]`);
            itemList.removeChild(li);
        } else if (change.type === 'modified') {
            const li = itemList.querySelector(`[data-id=${change.doc.id}]`);
            li.querySelector('span').textContent = change.doc.data().name;
        }
    });
});

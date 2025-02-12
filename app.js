import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
// Configurações do Firebase
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_AUTH_DOMAIN",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_STORAGE_BUCKET",
    messagingSenderId: "SEU_MESSAGING_SENDER_ID",
    appId: "SEU_APP_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("Firebase inicializado com sucesso:", app);

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
        console.error("Error adding document: ", error);
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
            console.error("Error deleting document: ", error);
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
                console.error("Error updating document: ", error);
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

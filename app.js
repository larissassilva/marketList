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
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Elementos do DOM
const addItemForm = document.getElementById('add-item-form');
const itemList = document.getElementById('item-list');

// Adicionar item
addItemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const itemName = document.getElementById('item-name').value;
    db.collection('items').add({
        name: itemName
    }).then(() => {
        document.getElementById('item-name').value = '';
    });
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
    deleteBtn.addEventListener('click', () => {
        const id = li.getAttribute('data-id');
        db.collection('items').doc(id).delete();
    });

    // Editar item
    editBtn.addEventListener('click', () => {
        const newName = prompt('Novo nome:', name.textContent);
        if (newName) {
            const id = li.getAttribute('data-id');
            db.collection('items').doc(id).update({
                name: newName
            });
        }
    });
}

db.collection('items').onSnapshot(snapshot => {
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

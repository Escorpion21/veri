// Selectores
const form = document.querySelector('#main-form');
const nameInput = document.querySelector('#name-input');
const phoneInput = document.querySelector('#phone-input');
const mainFormBtn = document.querySelector('#main-form-btn');
const contactsList = document.querySelector('#contacts-list');
const edition = document.querySelector("#contacts-list-item-name-input")
const input = document.querySelectorAll("#inputs-container")

const NAME_REGEX = /^[A-Z]{1}[a-z]*[ ][A-Z]{1}[a-z]*$/;
const PHONE_REGEX = /^(0212|0412|0424|0414|0426|0416)[0-9]{7}$/;

let nameInputValidation = false;
let phoneInputValidation = false;




const contactsManagerInit = () => {
  let contacts = []; 
  const publicAPI = {
    getContacts: () => {
      return contacts;
    },
    // JSDOC
    /**
    * Agrega un nuevo contacto.
    * @param {Object} newContact - El contacto a agregar.
    * @param {string} newContact.id - El id del contacto.
    * @param {string} newContact.name - El nombre del contacto.
    * @param {string} newContact.phone - El telefono del contacto.
    * @returns void.
    */
    addContact: (newContact) => {
      contacts = contacts.concat(newContact);
      console.log('Guardado el nuevo contacto!');
    },
    saveInBrowser: () => {
      localStorage.setItem('contactsList', JSON.stringify(contacts));
      console.log('Guardado en el navegador!'); 
    },
    renderContacts: () => {
      // Borrar el contenido de la lista.
      contactsList.innerHTML = '';
      // 1. Crear un bucle
      contacts.forEach(contact => {
        // 2. Acceder a cada contacto
        // 3. Crear un li para cada contacto
        const listItem = document.createElement('li');
        listItem.classList.add('contacts-list-item');
        listItem.id = contact.id;
        
        // 4. Crear la estructura para cada li
        listItem.innerHTML = `
          <div class="inputs-container">
            <input class="contacts-list-item-name-input" type="text" value="${contact.name}" readonly>
            <input class="contacts-list-item-phone-input" type="text" value="${contact.phone}" readonly>
          </div>
          <div class="btns-container">
            <button class="edit-btn">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>            
            </button>
            <button class="delete-btn">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        `;

        // 5. Agregar el li a la ul (como un hijo)
        contactsList.append(listItem)
      });
    },
    replaceContacts: (localContacts) => {
      contacts = localContacts;
    },
    deleteContact: (id) => {
      contacts = contacts.filter(contact => {
        if (id !== contact.id) {
          return contact;
        }
      });      
    },
    editContact: (editedContact) => {
      contacts = contacts.map(contact => {
        if (editedContact.id === contact.id) {
          return editedContact;
        } else {
          return contact;
        }
      });
    }
  }
  return publicAPI;
}
const contactsManager = contactsManagerInit();



// 1
// 3

const validateInput = (input, validation) => {
  const helpText = input.parentElement.children[2];
  if (input.value === '') {
    input.classList.remove('valid');
    input.classList.remove('invalid');
    helpText.classList.remove('invalidText');
  } else if (validation) {
    input.classList.add('valid');
    input.classList.remove('invalid');
    helpText.classList.remove('invalidText');
  } else {
    input.classList.add('invalid');
    input.classList.remove('valid');
    helpText.classList.add('invalidText');
  }
}
//////// VAliDacion de el input editado




// Evento: Input
nameInput.addEventListener('input', e => {
  nameInputValidation = NAME_REGEX.test(nameInput.value);
  validateInput(nameInput, nameInputValidation);
  checkValidations();
});

phoneInput.addEventListener('input', e => {
  phoneInputValidation = PHONE_REGEX.test(phoneInput.value);
  validateInput(phoneInput, phoneInputValidation);
  checkValidations();
});

form.addEventListener('submit', (e) => {
  console.log('Añadiendo contacto...');
  // Elimino la funcionalidad por defecto del formulario
  e.preventDefault();

  // Valido que ambas validaciones son correctas
  if (!nameInputValidation || !phoneInputValidation) return;
  console.log('Contacto validado correctamente!');

  // Creo el nuevo contacto
  console.log('Creando objeto del contacto ....');
  const newContact = {
    id: crypto.randomUUID(),
    name: nameInput.value,
    phone: phoneInput.value,
  }

  console.log('Objeto del contacto creado', newContact);

  // Añado el contacto al array
  console.log('Añadiendo contacto...')
  contactsManager.addContact(newContact);

  // Guardo los contactos en el navegador
  console.log('Añadiendo contacto al navegador...')
  contactsManager.saveInBrowser();

  // Mostrar en el html
  console.log('Mostrando en el html...')
  contactsManager.renderContacts();
});

contactsList.addEventListener('click', e => {
  // Selecciono el boton de eliminar
  const deleteBtn = e.target.closest('.delete-btn');
  const editBtn = e.target.closest('.edit-btn');

  // Si se clickea el boton de eliminar se empieza el proceso de eliminar
  if (deleteBtn) {
    // Selecciono el li del boton clickeado
    const li = deleteBtn.parentElement.parentElement;
    // Obtengo el id del li seleccionado
    const id = li.id;
    // Se elimina el contacto del array de contactos.
    contactsManager.deleteContact(id);
    // Se guarda de el array actualizado en el navegador.
    contactsManager.saveInBrowser();
    // Se renderiza el array sin el contacto eliminado.
    contactsManager.renderContacts();
  }

  if (editBtn) {
    // Selecciono el li
    const li = editBtn.parentElement.parentElement;
    // Selecciono ambos inputs
    const nameInputEdit = li.children[0].children[0];
    const phoneInputEdit = li.children[0].children[1];

    const validateInput = (nameInputEdit, validation) => {
      const helpText = li.children[0].children[0];
      if (nameInputEdit.value === '') {
        helpText.classList.add('validtext');
        helpText.classList.add('invalid');
        helpText.classList.remove('invalidText');
      } else if (validation) {
        helpText.classList.add('validtext');
        helpText.classList.add('invalid');
        helpText.classList.remove('invalidText');
      } else {
       helpText.classList.add('invalidText');
       helpText.classList.remove('validtext');
        helpText.classList.add('invalidText');
      }
    }
    //////// VAliDacion de el input editado
    
    const validateInpu = (phoneInputEdit, validation) => {
      const helpText = li.children[0].children[1];
      if (phoneInputEdit.value === '') {
        helpText.classList.add('validtext');
        helpText.classList.add('invalid');
        helpText.classList.remove('invalidText');
      } else if (validation) {
        helpText.classList.add('validtext');
        helpText.classList.add('invalid');
        helpText.classList.remove('invalidText');
      } else {
        helpText.classList.add('invalidText');
        helpText.classList.remove('validtext');
         helpText.classList.add('invalidText');
      }
    }
    
    
    // Evento: Input
    nameInputEdit.addEventListener('input', e => {
      nameInputValidation = NAME_REGEX.test(nameInputEdit.value);
      validateInput(nameInputEdit, nameInputValidation);
      checkValidations();
    });
    
    phoneInputEdit.addEventListener('input', e => {
      phoneInputValidation = PHONE_REGEX.test(phoneInputEdit.value);
      validateInpu(phoneInputEdit, phoneInputValidation);
      checkValidations();
    });
    





    if (editBtn.classList.contains('editando')) {
      editBtn.classList.remove('editando');
      // Añado el atributo readonly para no poder editar los contactos
      nameInputEdit.setAttribute('readonly', true);
      phoneInputEdit.setAttribute('readonly', true);

      // Creo el contacto editado usando la informacion del html
      const contactEdited = {
        id: li.id,
        name: nameInputEdit.value,
        phone: phoneInputEdit.value
      }
      // Se crea un nuevo array con el nuevo contacto editado
      contactsManager.editContact(contactEdited);
      // Se guarda de el array actualizado en el navegador.
      contactsManager.saveInBrowser();
      // Se renderiza el array sin el contacto eliminado.
      contactsManager.renderContacts();
    } else {
      editBtn.classList.add('editando');
      // Remuevo el atributo readonly para poder editar los contactos
      nameInputEdit.removeAttribute('readonly');
      phoneInputEdit.removeAttribute('readonly')
    }
  }
  
});

window.onload = () => {
  // Obtengo los contactos de local storage
  const getContactsLocal = localStorage.getItem('contactsList');
  // Paso los contactos de json a javascript
  const contactsLocal = JSON.parse(getContactsLocal);
  // Compruebo si existen contactos guardados en el navegador
  if (!contactsLocal) {
    // Reemplazo los contactos con un array vacio.
    contactsManager.replaceContacts([]);
  } else {
    // Reemplazo el array de contactos con los contactos guardados en el navegador
    contactsManager.replaceContacts(contactsLocal);
  }
  // Muestro los contactos en el html
  contactsManager.renderContacts();
}

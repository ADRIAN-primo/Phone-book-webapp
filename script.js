document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const contactForm = document.getElementById('contact-form');
    const contactList = document.getElementById('contact-list');
    const searchInput = document.getElementById('search');
    const logoutButton = document.getElementById('logout');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const users = JSON.parse(localStorage.getItem('users')) || {};
            if (users[email] && users[email] === password) {
                localStorage.setItem('loggedInUser', email);
                window.location.href = 'index.html';
            } else {
                alert('Invalid email or password');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('reg-email').value.trim();
            const password = document.getElementById('reg-password').value.trim();
            const users = JSON.parse(localStorage.getItem('users')) || {};
            if (users[email]) {
                alert('User already exists');
            } else {
                users[email] = password;
                localStorage.setItem('users', JSON.stringify(users));
                window.location.href = 'login.html';
            }
        });
    }

    if (contactForm) {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser) {
            window.location.href = 'login.html';
        }
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            let contacts = JSON.parse(localStorage.getItem('contacts')) || {};
            if (!contacts[loggedInUser]) {
                contacts[loggedInUser] = {};
            }
            contacts[loggedInUser][name] = phone;
            localStorage.setItem('contacts', JSON.stringify(contacts));
            renderContacts();
            contactForm.reset();
        });

        searchInput.addEventListener('input', renderContacts);

        function renderContacts() {
            const searchTerm = searchInput.value.toLowerCase();
            const contacts = JSON.parse(localStorage.getItem('contacts')) || {};
            const userContacts = contacts[loggedInUser] || {};
            contactList.innerHTML = '';
            for (const [name, phone] of Object.entries(userContacts)) {
                if (name.toLowerCase().includes(searchTerm)) {
                    const li = document.createElement('li');
                    li.textContent = `${name}: ${phone}`;
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.className = 'delete-btn';
                    deleteButton.addEventListener('click', () => {
                        delete userContacts[name];
                        contacts[loggedInUser] = userContacts;
                        localStorage.setItem('contacts', JSON.stringify(contacts));
                        renderContacts();
                    });
                    li.appendChild(deleteButton);
                    contactList.appendChild(li);
                }
            }
        }

        renderContacts();

        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                localStorage.removeItem('loggedInUser');
                window.location.href = 'login.html';
            });
        }
    }
});

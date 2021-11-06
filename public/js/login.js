const form = document.querySelector('form');
const emailError = document.querySelector('.email.error');
const passwordError = document.querySelector('.password.error');

form.addEventListener('submit', async e => {
    e.preventDefault();

    //emptying error div
    emailError.textContent = '';
    passwordError.textContent = '';

    //get the values from the login screen
    const email = form.email.value;
    const password = form.password.value;

    try {
        const fetchRes = await fetch('/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        });

        const data = await fetchRes.json();
        console.log('data', data);

        //failure ... error handling
        if(data.errors) {
            emailError.textContent = data.errors.email;
            passwordError.textContent = data.errors.password;
        }

        //success ... redirect to home page
        if(data.loginUser) {
            location.assign('/');
        }
        
    } catch (err) { 
        console.log(err);
    }
})
const form = document.querySelector('form');
const emailError = document.querySelector('.email.error');
const passwordError = document.querySelector('.password.error');

form.addEventListener('submit', async e => {
    e.preventDefault();

    //flush the values
    emailError.textContent = '';
    passwordError.textContent = '';   
    
    //get the values
    const email = form.email.value;
    const password = form.password.value;

    try {
        const fetchRes = await fetch('/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        });

        const data = await fetchRes.json();
        
        //Error
        if(data.errors) {
            emailError.textContent = data.errors.email;
            passwordError.textContent = data.errors.password;
        }

        //success... route to home page
        if(data.newUser) {
            location.assign('/');
        }
                
    } catch (err) {
        console.log(err);        
    }
});
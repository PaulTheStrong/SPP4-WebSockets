import React, { useState } from 'react'
import PropTypes from 'prop-types'

function Login({loginCallback}) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    
    async function login(e) {
        e.preventDefault();
        try {
            let creds = {username, password};
            let response = await fetch("http://localhost:10005/auth/", {
                method: "POST",
                body: JSON.stringify(creds),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include'
            });
            if (response.ok) {
                loginCallback();
            }
        } catch (err) {
            console.log (err);
        }
    }

    return (
        <form>
            <input type="text" onChange={(e) => setUsername(e.target.value)} minLength="4" maxLength="20"/>
            <input type="password" onChange={e => setPassword(e.target.value)} minLength="6" maxLength="64"/>
            <button type="submit" onClick={login}>Login</button>
        </form>
    )    
}

Login.propTypes = {
    loginCallback: PropTypes.func.isRequired
}

export default Login;
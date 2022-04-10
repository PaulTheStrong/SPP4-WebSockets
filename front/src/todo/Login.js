import React, { useState } from 'react'
import PropTypes from 'prop-types'

function Login({loginCallback}) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    
    function login(e) {
        e.preventDefault();

        fetch("http://127.0.0.1:10000/auth", {
            method: "POST",
            body: `{
                "username" : "${username}",
                "password" : "${password}"
            }`,
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include'
        })
        .then(response => ({ok: response.ok, message: response.message}))
        .then(({ok, message}) => {
            console.log()
            if (!ok) {
                console.log(message);
                return;
            }
            loginCallback();
        })
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
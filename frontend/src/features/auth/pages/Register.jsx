import React, { useState } from 'react'
import "../style/Register.scss"
import FormGroup from '../components/FormGroup'
import { Link } from 'react-router'
import {useAuth} from "../hooks/useAuth"
import {useNavigate} from "react-router"

const Register = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const {loading , handleRegister} = useAuth()

    async function handleSubmit (e) {
        e.preventDefault()

        await handleRegister({username , email , password})

        navigate('/')
       

    }
    return (
        <main className="register-page">
            <div className='form-container'>
                <h1>Register</h1>
                <form onSubmit={handleSubmit}>
                    <FormGroup
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        label="Username" placeholder="Enter your username" />
                    <FormGroup
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        label="Email" placeholder="Enter your email" />
                    <FormGroup
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        label="Password" placeholder="Enter your password" />
                    <button type="submit" className="button">Register</button>
                </form>
                <p>Already have an account ? <Link to="/login">Login</Link></p>
            </div>
        </main>
    )
}

export default Register
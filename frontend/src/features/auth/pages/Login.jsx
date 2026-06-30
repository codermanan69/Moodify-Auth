import React, {useState} from 'react';
import "../style/Login.scss";
import FormGroup from '../components/FormGroup';
import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router';

const Login = () => {
    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")

        try {
            await handleLogin({email, password})
            navigate("/")
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Login failed. Please check your credentials.")
        }
    }
    return (
        <main className="login-page">
            <div className="form-container">
                <h1>Login</h1>
                {error && (
                    <div style={{
                        background: 'rgba(221, 66, 0, 0.15)',
                        border: '1px solid #dd4200',
                        color: '#ff6a00',
                        borderRadius: '8px',
                        padding: '12px',
                        marginBottom: '16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <FormGroup
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        label="Email"
                        placeholder="Enter your email"
                    />
                    <FormGroup
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        label="Password"
                        placeholder="Enter your password"
                    />
                    <button className='button' type='submit'>Login</button>
                </form>
                <p>Don't have an account ? <Link to="/register">Register</Link></p>
            </div>
        </main>
    );
};

export default Login;

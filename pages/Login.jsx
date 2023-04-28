import React, { useState } from "react"
import { 
    useNavigate, 
    useLoaderData, 
    Form,
    redirect 
} from "react-router-dom"
import { loginUser } from "../api"

export function loader({ request }) {
    return new URL(request.url).searchParams.get("message")
}

export async function action({ request }) {
    const formData = await request.formData()
    const email = formData.get("email")
    const password = formData.get("password")
    const data = await loginUser({ email, password })
    localStorage.setItem("loggedin", true)
    return redirect("/host")
}

export default function Login() {
    const [status, setStatus] = useState("idle")
    const [error, setError] = useState(null)
    const message = useLoaderData()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setStatus("submitting")
        setError(null)
        loginUser(loginFormData)
            .then(data => {
                navigate("/host", { replace: true })
                setStatus("idle")
            })
            .catch(err => { setError(err) })
            .finally(() => setStatus("idle"))
    }

    function handleChange(e) {
        const { name, value } = e.target
        setLoginFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <div className="login-container">

            <h1>Sign in to your account</h1>
            {message && <h3 className="red">{message}</h3>}
            {error && <h3 className="red">{error.message}</h3>}

            <Form method="post" className="login-form">
                <input
                    name="email"
                    type="email"
                    placeholder="Email address"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                />
                <button type="submit" disabled={status === "submitting"}>
                    {status === "submitting" ? "Submitting..." : "Submit"}
                </button>
            </Form>

        </div>
    )

}
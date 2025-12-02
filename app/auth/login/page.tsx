'use client'
import { signIn } from 'next-auth/react'
import { useState, FormEvent } from 'react'


export default function LoginPage() {
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')


async function handleLogin(e: FormEvent<HTMLFormElement>) {
e.preventDefault()
await signIn('credentials', { email, password, callbackUrl: '/dashboard' })
}


return (
<div className="max-w-sm mx-auto mt-20">
<h1 className="text-xl font-bold mb-4">Login</h1>
<form onSubmit={handleLogin} className="flex flex-col gap-4">
<input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="border p-2" />
<input value={password} type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="border p-2" />
<button className="bg-blue-600 text-white py-2">Sign In</button>
</form>
</div>
)
}
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'PATIENT'
  })

  const [error, setError] = useState('')

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Registration failed')
      return
    }

    router.push('/login')
  }

  return (
    <div className="max-w-sm mx-auto mt-20 p-4 border rounded">
      <h1 className="text-xl font-bold mb-4">Create Account</h1>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Full Name"
          className="border p-2"
        />
        <input
          value={form.email}
          type="email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
          className="border p-2"
        />
        <input
          value={form.password}
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Password"
          className="border p-2"
        />

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="border p-2"
        >
          <option value="PATIENT">Patient</option>
          <option value="DOCTOR">Doctor</option>
        </select>

        <button className="bg-green-600 text-white py-2">Register</button>
      </form>
    </div>
  )
}

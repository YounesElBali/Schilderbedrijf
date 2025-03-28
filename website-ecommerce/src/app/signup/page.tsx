"use client"
import { useState } from "react";

export default function Signup() {
  const [formData, setFormData] = useState({ firstname: "", lastname: "", phone: "", email: "", profilePicture: "", homeAddress: "", password: "" });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) alert("Signup successful!");
    else alert("Signup failed!");
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="firstname" placeholder="First Name" onChange={handleChange} required />
      <input type="text" name="lastname" placeholder="Last Name" onChange={handleChange} required />
      <input type="number" name="phone" placeholder="Phone" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="text" name="profilePicture" placeholder="Profile Picture URL" onChange={handleChange} required />
      <input type="text" name="homeAddress" placeholder="Home Address" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Signup</button>
    </form>
  );
}

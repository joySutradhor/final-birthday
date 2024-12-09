import axios from 'axios';
import { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


function UserLogin() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem('rootToken'); 

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/root-page', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      email: userName,
      password: password,
    };
    console.log(payload)

    Swal.fire({
      title: 'Do You Want to Login?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#374151',
      confirmButtonText: 'Yes, Login!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post('https://birthday-gift-web.vercel.app/api/v1/auth/login', payload)
          .then((res) => {
            localStorage.setItem('rootToken', JSON.stringify(res.data.access_token));
            Swal.fire({
              title: 'Login Successful!',
              text: 'You are now authorized.',
              icon: 'success',
            });
            navigate('/root-page');
          })
          .catch(() => {
            setErr('Login Failed. Check Credentials.');
          });
      }
    });
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-sm shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-2">
              Username
            </label>
            <input
              type="email"
              id="userName"
              className="w-full px-4 py-2 border rounded-sm focus:outline-none"
              placeholder="Enter your username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-2">
              Password
            </label>
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              className="w-full px-4 py-2 border rounded-sm focus:outline-none"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-10 cursor-pointer text-gray-500"
            >
              {passwordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </span>
          </div>
          {err && <p className="text-red-500 text-sm mb-4">{err}</p>}
          <button type="submit" className="w-full bg-gray-700 text-white py-2 rounded-sm">
            Login
          </button>
        </form>
      </div>
    </section>
  );
}

export default UserLogin;

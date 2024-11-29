import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Swal from 'sweetalert2';

function Login() {
  const dummyUser = {
    email: 'valulizer',
    password: 'WillYouMarryMe',
  };

  const { login } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === dummyUser.email && password === dummyUser.password) {
      setError('');
      login(); // Authenticate user
      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'Welcome to your dashboard!',
        confirmButtonText: 'Go to Dashboard',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/dashboardWebsite'); // Redirect to dashboard
        }
      });
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-sm shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Secret Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="email"
              className="w-full px-4 py-2 border rounded-sm focus:outline-none"
              placeholder="Enter your name"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button type="submit" className="w-full bg-gray-700 text-white py-2 rounded-sm">
            Login Here
          </button>
        </form>
      </div>
    </section>
  );
}

export default Login;

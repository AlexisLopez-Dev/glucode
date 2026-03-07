import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const Dashboard = () => {

  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        ¡Bienvenido a Glucode, {user?.name}!
      </h1>
      <p className="text-gray-600 mb-8">
        Tu correo es: {user?.email}
      </p>

      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200 shadow-md"
      >
        Cerrar Sesión
      </button>
    </div>
  )
}
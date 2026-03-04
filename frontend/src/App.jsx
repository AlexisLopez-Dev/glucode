import { useState } from 'react'
import { API_BASE_URL } from './config';

function App() {
  const [mensaje, setMensaje] = useState('Esperando conexión con el backend...')

  const hacerPing = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/ping`);
      const data = await response.json()
      setMensaje(data.message)
    } catch (error) {
      setMensaje('Error de conexión con el servidor: ' + error)
    }
  }

  return (
    <div>
      <h1>Glucode: Walking Skeleton</h1>
      <button onClick={hacerPing} >Conectar con Laravel</button>
      <p>{mensaje}</p>
    </div>
  )
}

export default App
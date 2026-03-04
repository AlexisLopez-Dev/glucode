import { useState } from 'react'

function App() {
  const [mensaje, setMensaje] = useState('Esperando conexión con el backend...')

  const hacerPing = async () => {
    try {
      const response = await fetch('http://backend.test/api/ping')
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
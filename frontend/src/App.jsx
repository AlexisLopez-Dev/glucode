import { AuthProvider } from './context/AuthProvider';
import { AppRouter } from './routers/AppRouter';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
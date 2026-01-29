import "./App.css";
import RouteApp from "./routes";
import { AuthProvider } from "./contexts/auth";

function App() {
  return (
    <AuthProvider>
      <div className="App">
          <div className="App2">
            <RouteApp />
          </div>
      </div>
    </AuthProvider>
  );
}

export default App;

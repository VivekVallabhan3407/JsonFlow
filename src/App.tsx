import './App.css'
import JsonEditor from './components/JsonEditor'
import "react-toastify/dist/ReactToastify.css"; // ✅ Toastify styles

function App() {

  return (
      <div className="App">
        <h1>JsonFlow</h1>
        <p>A simple tool to format and validate your JSON easily.</p>
        <JsonEditor />
      </div>      
  )
}

export default App;

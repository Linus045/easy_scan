import './App.css';
import PrintersList from './PrintersList.js'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Printers found in the local network:
        </p>
        <PrintersList />
      </header>
    </div>
  );
}

export default App;

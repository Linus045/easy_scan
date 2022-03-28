import React, {useState} from 'react'
import './App.css';
import PrintersList from './PrintersList.js'
import FileUploadButton from './FileUploadButton.js'
import StorageList, {StorageContext} from './StorageList.js'


const storage = {
  files: [],
  setFiles : () => {}
};

function App() {
  const [files, setFiles] = useState(null)
  const storage = {files, setFiles}
  return (
    <StorageContext.Provider value={storage}>
    <div className="App">
      <header className="App-header">
        <p>
          Printers found in the local network:
        </p>
        <PrintersList />
        <FileUploadButton />
        <StorageList />
      </header>
    </div>
    </StorageContext.Provider>
  );
}

export default App;

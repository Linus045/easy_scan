import React from 'react'
import './App.css';
import PrintersList from './PrintersList.js'
import FileUploadButton from './FileUploadButton.js'
import StorageList from './StorageList.js'
import Consumer, {StorageContextProvider} from './StorageContextProvider.js'


function App() {
  return (
    <StorageContextProvider>
    <div className="App">
      <header className="App-header">
        <p>
          Printers found in the local network:
        </p>
        <PrintersList />
        <Consumer>
            {ctx => 
              { 
                console.log("RE-RENDERED CONSUMER STUFF")
                return (
                  <div>
                    <StorageList files={ctx.files} metadataForFile={ctx.metadataForFile} />
                    <FileUploadButton setFiles={ctx.setFiles} setMetadataForFile={ctx.setMetadataForFile}/>
                  </div>
                )}}
        </Consumer>
      </header>
    </div>
    </StorageContextProvider>
  );
}

export default App;

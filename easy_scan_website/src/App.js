import React from 'react'
import './App.css';
import PrintersList from './PrintersList.js'
import FileUploadButton from './FileUploadButton.js'
import StorageList from './StorageList.js'
import EditView from './edit_view/EditView.js'

import Consumer, { StorageContextProvider } from './StorageContextProvider.js'


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
            {ctx => {
              console.log("RE-RENDERED CONSUMER STUFF")
              if (!ctx.showFileEditor) {
                return (
                  <div>
                    <FileUploadButton
                      setFiles={ctx.setFiles}
                      setMetadataForFile={ctx.setMetadataForFile}
                      setTransformations={ctx.setTransformations}
                      setShowFileEditor={ctx.setShowFileEditor}
                      />
                  </div>
                )
              } else {
                return (
                  <div>
                    <EditView files={ctx.files} metadataForFile={ctx.metadataForFile} transformations={ctx.transformations} setTransformations={ctx.setTransformations} />
                  </div>
                )
              }
            }}
          </Consumer>
        </header>
      </div>
    </StorageContextProvider>
  );
}

export default App;

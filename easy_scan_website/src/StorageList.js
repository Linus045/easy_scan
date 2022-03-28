import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item';
import React, { useContext } from 'react';
import StorageContext from './StorageContextProvider.js'

function StorageList() {
  let storage = useContext(StorageContext);
  console.log(storage)
  console.log("Rendering StorageList with files:", storage.files)
  if (storage.files == null) {
    return null;
  }
  console.log(storage.files)

  let filesHtml = [];
  for (let i = 0; i < storage.files.length; ++i) {
    filesHtml.push(
      <mwc-list-item>
        {storage.files[i].name}
      </mwc-list-item>
    );
  }
  return (
    <mwc-list>
      {filesHtml}
    </mwc-list>
  )
}
export { StorageContext }
export default StorageList

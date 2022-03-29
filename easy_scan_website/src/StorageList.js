import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item';
import React, { useContext } from 'react';
import Consumer, { StorageContext } from './StorageContextProvider.js'


function StorageList(props) {
  const files = props.files
  const metadata = props.metadataForFile
  console.log("Rendering list with files:", files)
  if (files == null) {
    return null;
  }


  let filesHtml = [];
  if (metadata == null) return null;

  for (let i = 0; i < files.length; i++) {
    let filename = files[i].name;
    if(metadata[filename] == null) {
      console.log(`Preview images for ${filename} were not found`)
      continue;
    }

    let previews = metadata[filename].preview_filenames
    let preview_images = [];
    // TODO: add null check for previews

    for (let j = 0; j < previews.length; j++) {
      let imageName = previews[j].replace(/\.[^/.]+$/, "") + "-1";
      let url = `http://${window.location.hostname}:8080/api/previews/${previews[j]}`;
      preview_images.push((
          <img 
            src={url} height={100} width={100} style={{height: '100', width: '100'}} alt={`${imageName} was not found`} />
      ))
    }
    //TODO: Request images after a delay or again if first request failed due to the previews not being generated
      filesHtml.push(
//        <mwc-list-item key={files[i].name} style={{height: '100%', width: '100%', 'object-fit': 'contain'}}>
        <div>
          {files[i].name}
          {preview_images}
    </div>
//        </mwc-list-item>
      );
  }
  return (
    <mwc-list>
      {filesHtml}
    </mwc-list>
  )
}
export default StorageList

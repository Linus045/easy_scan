import React, {useState, useContext} from 'react'
import '@material/mwc-button'
import {} from './StorageContextProvider.js'

// TODO: Move into other file
const UploadStatus = {
    Unknown: 0,
    Uploading: 1,
    Failed: 2,
    OK: 3,
}


function FileUploadButton(props) {
  let [uploadStatus, setUploadStatus] = useState(UploadStatus.Unknown);
  let setFiles = props.setFiles;
  let setMetadataForFile = props.setMetadataForFile
  const [inputFiles, setInputFiles] = useState([]);

  let uploadStatusHtml;
  switch (uploadStatus) {
    case UploadStatus.OK:
      uploadStatusHtml = <h1>Upload successful!</h1>;
      break;
    case UploadStatus.Failed:
      uploadStatusHtml = <h1>Upload failed!</h1>;
      break;
    case UploadStatus.Uploading:
      uploadStatusHtml = <h1>Uploading...</h1>;
      break;
    default:
      uploadStatusHtml = <h1>ERROR: UploadStatus not defined</h1>;
  }

  function onUploadFiles(event) {
    let uploadRequest = new XMLHttpRequest();

    let url = `http://${window.location.hostname}:8080/api/upload`
    uploadRequest.addEventListener("load", (event) => {
      setUploadStatus(UploadStatus.OK)
      console.log("Files uploaded, refreshing file storage context", inputFiles)
      setFiles(inputFiles)

      for (let i = 0; i < inputFiles.length; ++i) {
        let file = inputFiles[i];
        let filename = file.name;
        let metadata_url = `http://${window.location.hostname}:8080/api/metadata/${filename}`
        fetch(metadata_url).then((response) => {
          response.json().then((data) => {
            setMetadataForFile(filename, data)
          });
        })
      }
    });

    uploadRequest.addEventListener("error", (event) => {
      setUploadStatus(UploadStatus.Failed)
    });

    uploadRequest.upload.addEventListener("loadstart", (event) => {
    });

    uploadRequest.upload.addEventListener("progress", (event) => {
      let percent = 100 / event.total * event.loaded;
      console.log(`Uploaded ${Math.trunc(percent)}/100%`);
    });


    let formdata = new FormData()
    for (let i = 0; i < inputFiles.length; i++) {
      formdata.append(inputFiles[i].name, inputFiles[i])
    }

    uploadRequest.open("POST", url, true);
    uploadRequest.send(formdata)
  }

  function onSelectFileClick() {
    document.getElementById("file_upload_input").click();

    let filesObject = document.getElementById("file_upload_input")
    setInputFiles(filesObject.files)
  }


  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          <input id="file_upload_input"  type="file" accept='image/*,.pdf' multiple/>
          <mwc-button onClick={onSelectFileClick}>Select File</mwc-button>
          <mwc-button onClick={onUploadFiles}>Upload Files</mwc-button>
        </label>
          {uploadStatusHtml}
      </form>
    </div>
  )
}


export default FileUploadButton;

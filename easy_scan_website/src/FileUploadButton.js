import React, {useState, useContext} from 'react'
import '@material/mwc-button'
import StorageContext from './StorageContextProvider.js'

// TODO: Move into other file
const UploadStatus = {
    Unknown: 0,
    Uploading: 1,
    Failed: 2,
    OK: 3,
}


function FileUploadButton() {
  let [uploadStatus, setUploadStatus] = useState(UploadStatus.Unknown);
  let {setFiles} = useContext(StorageContext);

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
    uploadRequest.addEventListener("onload", (event) => {
      console.log(event)
      setUploadStatus(UploadStatus.OK)
    });

    uploadRequest.upload.addEventListener("loadstart", (event) => {
      console.log("Load Start:")
      console.log(event);
    });

    uploadRequest.upload.addEventListener("progress", (event) => {
      console.log("Progress:")
      console.log(event);
      let percent = 100 / event.total * event.loaded;
      console.log(`Uploaded ${Math.trunc(percent)}/100%`);
    });

    uploadRequest.addEventListener("error", (event) => {
      setUploadStatus(UploadStatus.Failed)
    });

    let filesObject = document.getElementById("file_upload_input")
    let files = filesObject.files
    // move these into local storage/cache?!

    console.log("Setting files: ", files)
    setFiles(files)

    let formdata = new FormData()
    for (let i = 0; i < files.length; i++) {
      formdata.append(files[i].name, files[i])
    }

    uploadRequest.open("POST", url, true);
    uploadRequest.send(formdata)
  }

  function onSelectFileClick() {
    console.log("Clicked")
    document.getElementById("file_upload_input").click();
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

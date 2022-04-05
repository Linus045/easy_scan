import React, {useState} from 'react'
import EditBar from "./EditBar.js";

function EditView(props) {
  const [files, setFiles] = useState(props.files)
  const metadata = props.metadataForFile
  const transformations  = props.transformations
  const setTransformations = props.setTransformations

  console.log("Started loading previews for files:", files)
  if (files == null) {
    return <h1>ERROR: No files to display</h1>;
  }

  console.log("Updated Editview. Transformations:");
  console.log(transformations);

  let filesHtml = [];
  if (metadata == null)
    return <h1>ERROR: No metadata to display</h1>;

  let preview_images = [];
  for (let i = 0; i < files.length; i++) {
    let filename = files[i].name;
    if (metadata[filename] == null) {
      console.log(`Preview images for ${filename} were not found`)
      continue;
    }

//    if(transformations[filename] == null)
//      continue

    let previews = metadata[filename].preview_filenames
    // TODO: add null check for previews

    for (let j = 0; j < previews.length; j++) {
      // TODO: Move to another place, not inside EditView
      let imageName = previews[j]//.replace(/\.[^/.]+$/, "");
      let imageRotation = transformations[imageName].rotation
      let url = `http://${window.location.hostname}:8080/api/previews/${previews[j]}`;
      //TODO: Request images after a delay or again if first request failed due to the previews not being generated
      preview_images.push((
        <li>
          <div style={{'border' : '2px solid #000000'}}>
            <h6>Name: {imageName} - Rot: {imageRotation} - Pos:{transformations[imageName].position}</h6>
            <img src={url} height={100} width={100} style={{ height: '100', width: '100',transform: `rotate(${imageRotation}deg)` }} alt={`${imageName} was not found`} />
            <EditBar imageName={imageName} transformations={[transformations, setTransformations]} MAX={previews.length}/>
          </div>
        </li>
      ))
    }
  }
  return (
    <ul style={{'listStyle': 'none', 'display': 'inline-flex'}}>
    {preview_images}
    </ul>
  )

}

export default EditView;

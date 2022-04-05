import React from 'react'
import '@material/mwc-button'
function EditBar(props) {
  let imageName = props.imageName;
  let [transformations, setTransformations] = props.transformations;
  // console.log("updated EditBar. Props:");
  // console.log(props.transformations)
  let MAX = props.MAX;

  function rotateImage() {
    const newTrasformation = transformations[imageName]
    newTrasformation.rotation = newTrasformation.rotation + 90
    // console.log("Updating tranformations in EditBar newTrasformation:");
    // console.log(newTrasformation);
    setTransformations(imageName, newTrasformation)
  }

  function deleteImage() {
    // tranformation.deleted = !tranformation.deleted
  }

  function moveLeft() {
    // tranformation.position = (tranformation.position > 1) ?
    //   tranformation.position - 1 :
    //   tranformation.position;
  }

  function moveRight() {
    // tranformation.position = (tranformation.position < MAX) ?
    //   tranformation.position + 1 :
    //   tranformation.position;
  }

  return (
    <div >
      <mwc-button label="Rotate" onClick={rotateImage}/>
      <mwc-button label="Delete" onClick={deleteImage}/>

      <mwc-button label="Move Left" onClick={moveLeft}/>
      <mwc-button label="Move Right" onClick={moveRight}/>
    </div>
  )
}

export default EditBar;

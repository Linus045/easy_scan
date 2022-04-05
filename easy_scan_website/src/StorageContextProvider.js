import React, { Component } from 'react'


const { Provider, Consumer } = React.createContext();

class StorageContextProvider extends Component {
  state = {
    showFileEditor : false,
    setShowFileEditor : (value) => this.setState({showFileEditor : value}),
    files: [],
    setFiles: (files) => {
      this.setState({ files: files })
    },
    metadataForFile: null,
    setMetadataForFile: (filename, metadata) => {
      if (this.state.metadataForFile == null)
        this.state.metadataForFile = {}
      this.state.metadataForFile[filename] = metadata
      this.setState({})
    },
    transformations : {},
    setTransformations: (filename, transformation) => {
      this.state.transformations[filename] = transformation
      this.setState({})
    }
  };

  render() {
    return (
      <Provider value={{
        files: this.state.files,
        setFiles: this.state.setFiles,
        setMetadataForFile: this.state.setMetadataForFile,
        metadataForFile: this.state.metadataForFile,
        transformations : this.state.transformations,
        setTransformations : this.state.setTransformations,
        showFileEditor : this.state.showFileEditor,
        setShowFileEditor : this.state.setShowFileEditor
      }}>
        {this.props.children}
      </Provider>
    )
  }
}

export { StorageContextProvider };
export default Consumer;

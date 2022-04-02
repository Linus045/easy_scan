import React, { Component } from 'react'


const { Provider, Consumer } = React.createContext();

class StorageContextProvider extends Component {
  state = {
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
    }
  };

  render() {
    return (
      <Provider value={{
        files: this.state.files,
        setFiles: this.state.setFiles,
        setMetadataForFile: this.state.setMetadataForFile,
        metadataForFile: this.state.metadataForFile
      }}>
        {this.props.children}
      </Provider>
    )
  }
}

export { StorageContextProvider };
export default Consumer;

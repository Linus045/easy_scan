import React, {Component} from 'react'
import '@material/mwc-button'
import '@material/mwc-list/mwc-list.js'
import '@material/mwc-list/mwc-list-item.js'



class PrintersList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      printers: "",
      isLoaded: false
    }
  }


  render() {
    const {isLoaded, printers} = this.state;
    if(isLoaded) {
      return (
        <div>
       <mwc-list activatable>
          {printers.map((item) => {
             return <mwc-list-item selected>{item.name} [{item.id}]</mwc-list-item>
            })
          }
        </mwc-list>
        </div>
      )
    }else
      return <h1>Loading...</h1>;
  }

  componentDidMount() {
    fetch('http://localhost:8080/printers')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            printers: result
          })
        },
        (error) => {
          this.setState({
            isLoaded: false,
            printers: "Error"
          })
        })
  }

}

export default PrintersList
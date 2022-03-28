import React from 'react'
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
             return <mwc-list-item key={item.name} selected>{item.name} [{item.id}]</mwc-list-item>
            })
          }
        </mwc-list>
        </div>
      )
    }else
      return <h1>Loading...</h1>;
  }

  componentDidMount() {
  // TODO: Adjust port and hostname here to some global variable 
    fetch(`http://${window.location.hostname}:8080/api/printers`)
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

import React, { Component } from "react";

import "./style.css";

class TableComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  tableRenderer = ({ ID, Distance, Flow, Timestamp }, i) => {
    return (
      <div key={i} className="data">
        {/* <span className="text">{ID}</span> */}
        {/* <span className="text">{Sensor}</span> */}
        {/* <span className="text">{Lokasi}</span> */}
        <span className="text">Current Water Level</span>
        <span className="text">{Distance} cm</span>
        <span className="text">Current Water Flow Rate</span>
        <span className="text">{Flow}</span>
        {/* <span className="text">{Timestamp}</span> */}
      </div>
    );
  };

  render() {
    // console.log(this.props);
    return (
      <div className="content">
        <h4>Sensor Reading</h4>
        <div className="dataContainer">
          {this.props.data.map(this.tableRenderer)}
        </div>
      </div>
    );
  }
}

export default TableComponent;

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
        <span className="text">Water Level</span>
        <span className="text">{Distance} cm</span>
        <span className="text">Status</span>
        <span className="text">{this.props.status}</span>
        <span className="text">Water Flow Rate</span>
        <span className="text">{Flow}</span>
      </div>
    );
  };

  render() {
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

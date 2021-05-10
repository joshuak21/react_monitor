import React, { Component } from "react";

import TableComponent from "../tableComponent/index";

import "./style.css";

class Homepage extends Component {
  intv1;

  startingCount = 0;
  placeholder = [];
  notification = [];
  message = {
    to: "",
    sound: "default",
    title: "",
    body: "",
  };

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      pushToken: [],
      isLoading: true,
      count: 0,
      isNotifSent: false,
      dangerLevel: 0,
    };
  }

  startInterval = () => {
    this.intv1 = setInterval(() => {
      this.setState({
        count: this.state.count + 1,
        isLoading: true,
      });
      this.fetchData();
      console.log("DATA UPDATED: ", this.state.data);
    }, 5000);
  };

  stopInterval = () => {
    clearInterval(this.intv1);
    this.setState({
      count: this.startingCount,
    });
  };

  fetchData = async () => {
    if (!!this.state.isLoading) {
      // console.log("YEP");
      return fetch("http://localhost:4000/api/check/")
        .then((res) => res.json())
        .then((resJSON) => {
          this.setState({
            data: resJSON,
            isLoading: false,
          });
          // this.checkDistance();
        });
    }
  };

  fetchPushToken = async () => {
    return fetch("http://192.168.0.20:4000/api/token")
      .then((res) => res.json())
      .then((resJSON) => {
        this.setState({
          pushToken: resJSON,
        });
        // console.log(this.state.pushToken);
        this.state.pushToken.map(this.arrangePushToken);
        this.message.to = this.placeholder;
        console.log(this.message);
      })
      .catch((e) => console.log(e));
  };

  startCount = () => {
    this.setState({
      count: this.state.count + 1,
      isLoading: true,
    });
    this.fetchData();
  };

  startTimeout = () => {
    this.startCount();
    // this.fetchData();
    setTimeout(this.startTimeout, 5000);
  };

  sendNotification = async (message) => {
    return await fetch("https://exp.host/--/api/v2/push/send", {
      mode: "no-cors",
      method: "POST",
      headers: {
        Accept: "application/json",
        // "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    }).catch((e) => console.log(e));
  };

  checkDistance = () => {
    let x = this.state.data[0].Distance;
    let messageTitle, messageBody, criticalLevel;
    // console.log(this.state.data[0].Distance);
    if (x < 25) {
      // if (!!this.state.isNotifSent) {
      this.fetchPushToken();
      if (x < 10) {
        // Critical Stage 3
        messageTitle = "Water Level Alert Stage 3";
        messageBody =
          "Nearby citizen be advised to be cautious, water level have reach " +
          x +
          " cm.";
        criticalLevel = 3;
      } else if (x >= 10 && x < 15) {
        // Critical Stage 2
        messageTitle = "Water Level Alert Stage 2";
        messageBody =
          "Nearby citizen be advised to be cautious, water level have reach " +
          x +
          " cm.";
        criticalLevel = 2;
      } else {
        // x >= 15 && x < 25
        // Critical Stage 1
        messageTitle = "Water Level Alert Stage 1";
        messageBody =
          "Potential Flood occuring, water level have reach " + x + " cm.";
        criticalLevel = 1;
      }

      if (criticalLevel > this.state.dangerLevel) {
        this.setState({
          isNotifSent: false,
          dangerLevel: criticalLevel,
        });

        if (!this.state.isNotifSent) {
          this.setState({
            isNotifSent: true,
          });
          this.message.title = messageTitle;
          this.message.body = messageBody;
          this.sendNotification(this.message);
          console.log("MESSAGE SENT ", this.state.dangerLevel);
          console.log(this.message);
        }
      }

      console.log(this.state.isNotifSent);
      // }
    } else {
      this.setState({
        isNotifSent: false,
        dangerLevel: 0,
      });
      console.log(this.state.isNotifSent);
    }
  };

  arrangePushToken = ({ Token }, i) => {
    this.placeholder[i] = Token;
  };

  componentDidMount() {
    console.log("COMPONENT IS MOUNT!!!");
    // this.startInterval();
    this.fetchData();

    this.startTimeout();
  }

  componentWillUnmount() {
    console.log("COMPONENT UNMOUNT!!!");
    // clearTimeout(this.startTimeout);
    this.stopInterval();
  }

  render() {
    return (
      <div className="container">
        <h1>SENSOR MONITOR</h1>

        {/* {!this.state.isLoading ? (
          <div>
          <span>Status : YEP</span>
          </div>
        ) : undefined} */}

        {this.state.isLoading === false && (
          <TableComponent data={this.state.data} />
        )}

        <p>{this.state.count}</p>
        {/* <button onClick={this.stopInterval}>Stop Interval</button>
        <button onClick={this.sendNotification}>Send Push Notification</button>
        <button onClick={this.fetchPushToken}>Fetch Token</button>
        <button onClick={this.checkDistance}>Check state data</button> */}
      </div>
    );
  }
}

export default Homepage;

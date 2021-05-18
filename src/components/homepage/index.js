import React, { Component } from "react";

import TableComponent from "../tableComponent/index";

import "./style.css";

class Homepage extends Component {
  intv1;

  startingCount = 0;
  token = [];
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
      isNotifSent: false,
      dangerLevel: 0,
      timestamp: "",
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
      return fetch("http://localhost:4000/api/check/")
        .then((res) => res.json())
        .then((resJSON) => {
          this.setState({
            data: resJSON,
            isLoading: false,
          });
          this.checkDistance();
        });
    }
  };

  fetchPushToken = async () => {
    return fetch("http://192.168.0.12:4000/api/token")
      .then((res) => res.json())
      .then((resJSON) => {
        this.setState({
          pushToken: resJSON,
        });
        // console.log(this.state.pushToken);
        this.state.pushToken.map(this.arrangePushToken);
        this.message.to = this.token;
        console.log(this.message);
      })
      .catch((e) => console.log(e));
  };

  startCount = () => {
    this.setState({
      isLoading: true,
    });
    this.fetchData();
  };

  startTimeout = () => {
    this.startCount();
    setTimeout(this.startTimeout, 5000);
  };

  sendNotification = async (message) => {
    return await fetch("https://exp.host/--/api/v2/push/send", {
      mode: "no-cors",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    }).catch((e) => console.log(e));
  };

  checkDistance = () => {
    let x = this.state.data[0].Distance;
    let messageTitle, messageBody, criticalLevel;
    if (x <= 30) {
      if (x > 20) {
        // Siaga 3 (21 - 30)
        messageTitle = "Siaga 3";
        messageBody = "Be advised, water level have reached " + x + " cm.";
        criticalLevel = 1;
      } else if (x <= 20 && x > 10) {
        // Siaga 2 (11 - 19)
        messageTitle = "Siaga 2";
        messageBody =
          "Nearby citizen be advised to be aware, water level have reach " +
          (12 - x) +
          " cm.";
        criticalLevel = 2;
      } else {
        // x <= 10 | Siaga 1 | (0 - 10)
        messageTitle = "Siaga 1";
        messageBody =
          "Warning! Water level have reached " +
          x +
          " cm. Nearby citizen please be aware of a potential floods!";
        criticalLevel = 3;
      }

      if (criticalLevel > this.state.dangerLevel) {
        this.setState({
          isNotifSent: false,
          dangerLevel: criticalLevel,
        });

        if (!this.state.isNotifSent) {
          this.fetchPushToken();
          this.setState({
            isNotifSent: true,
            timestamp: new Date(),
          });
          this.message.title = messageTitle;
          this.message.body = messageBody;
          // this.sendNotification(this.message);
          // console.log("MESSAGE SENT ", this.state.dangerLevel);
          // console.log(this.message);
        }
      }
    } else {
      this.setState({
        isNotifSent: false,
        dangerLevel: 0,
      });
    }
  };

  arrangePushToken = ({ Token }, i) => {
    this.token[i] = Token;
  };

  componentDidMount() {
    // console.log("COMPONENT IS MOUNT!!!");
    this.fetchData();

    this.startTimeout();
  }

  componentWillUnmount() {
    // console.log("COMPONENT UNMOUNT!!!");
    this.stopInterval();
  }

  render() {
    return (
      <div className="container">
        <h1>SENSOR MONITOR</h1>

        {!!this.state.isNotifSent && (
          <div>
            <p>Push Notification Sent</p>
            <p>Critical Status: {this.state.dangerLevel}</p>
            <p>Sent at: {this.state.timestamp.toString()}</p>
          </div>
        )}

        {this.state.isLoading === false && (
          <TableComponent
            data={this.state.data}
            status={this.state.dangerLevel}
          />
        )}
      </div>
    );
  }
}

export default Homepage;

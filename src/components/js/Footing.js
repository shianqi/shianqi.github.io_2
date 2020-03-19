import React from "react";
let $ = require("jquery");
let host = "http://115.28.72.26:3000/";

class Footing extends React.Component {
  state = {
    visitNumber: "0"
  };

  componentDidMount() {
    $.ajax({
      url: host + "visitNumber",
      type: "GET",
      success: function(data) {
        this.setState({
          visitNumber: data
        });
      }.bind(this)
    });
  }

  render() {
    return (
      <div className="footing">
        <div className="contactMe">
          <h3 className="aboutWebsite">CONTACT ME&nbsp;&nbsp;&nbsp;&nbsp;</h3>
          <p className="aboutWebsite">
            E-mail：<a href="mailto:shianqi@imudges.com">shianqi@imudges.com</a>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <br />
            Mobile Phone: <a href="#">15661131738</a>&nbsp;&nbsp;&nbsp;&nbsp;
            <br />
            Github:{" "}
            <a href="https://github.com/shianqi" target="_blank">
              github.com/shianqi
            </a>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <br />
            Tencent QQ:{" "}
            <a href="tencent://message/?uin=1210219084&amp;Site=有事Q我&amp;Menu=yes">
              1210219084
            </a>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <br />
          </p>
        </div>
        <div className="contactWebsite">
          <h3 className="aboutWebsite">
            &nbsp;&nbsp;&nbsp;&nbsp;ABOUT WEBSITE
          </h3>
          <p className="aboutWebsite">
            &nbsp;&nbsp;&nbsp;&nbsp;Power By:&nbsp;&nbsp;{" "}
            <a href="https://github.com/facebook/react" target="_blank">
              React
            </a>
            &{" "}
            <a href="https://nodejs.org/en/" target="_blank">
              NodeJs
            </a>
            &{" "}
            <a href="https://www.mongodb.com/" target="_blank">
              MongoDB
            </a>{" "}
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;Server:{" "}
            <a
              href="https://github.com/shianqi/shianqi.github.io_2_server"
              target="_blank"
            >
              shianqi.github.io_2_server
            </a>
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;Website:{" "}
            <a
              href="https://github.com/shianqi/shianqi.github.io_2"
              target="_blank"
            >
              shianqi.github.io_2
            </a>{" "}
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;历史访问人次： {this.state.visitNumber}
            <br />
          </p>
        </div>
        <Copyright />
      </div>
    );
  }
}

class Copyright extends React.Component {
  render() {
    return (
      <div className="Copyright">
        <br />
        Copyright ©2016 Archie Shi <br />
        <a
          href="https://beian.aliyun.com/order/customerSiteView?siteId=3172118"
          target="_blank"
        >
          蒙ICP备16004045号-1
        </a>
        website-version:&nbsp;&nbsp;v2.0.0
        <br />
      </div>
    );
  }
}

module.exports = Footing;

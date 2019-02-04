import React from "react";
import BubbleScatter from "./BubbleScatter";

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 10, // anything
      height: 10,
      data: []
    };
  }

  setViewport() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  componentDidMount() {
    this.setViewport();
    window.addEventListener("resize", this.setViewport.bind(this), false);

    fetch("data.json")
      .then(res => res.json())
      .then(data => this.setState({ data }));
  }

  render() {
    const { width, height, data } = this.state;

    return <BubbleScatter width={width} height={height} data={data} />;
  }
}

import React from "react";
import Layout from "../components/layout";
import BubbleScatter from "../components/bubble-scatter";

export default class extends React.Component {
  static async getInitialProps() {
    const data = await import("../static/data.json");
    return { data };
  }

  constructor(props) {
    super(props);

    this.state = {
      width: 10, // anything
      height: 10
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
  }

  render() {
    const { data } = this.props;
    const { width, height } = this.state;

    return (
      <Layout>
        <style jsx global>{`
          body {
            margin: 0;
            overflow: hidden;
            height: 100vh;
          }
        `}</style>
        <BubbleScatter width={width} height={height} data={data.default} />
      </Layout>
    );
  }
}

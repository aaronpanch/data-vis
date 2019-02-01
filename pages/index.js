import React from "react";
import Layout from "../components/layout";
import BubbleScatter from "../components/bubble-scatter";

export default class extends React.Component {
  static async getInitialProps() {
    const data = await import("../static/data.json");
    return { data };
  }

  render() {
    const { data } = this.props;

    return (
      <Layout>
        <BubbleScatter width={1000} height={840} data={data.default} />
      </Layout>
    );
  }
}

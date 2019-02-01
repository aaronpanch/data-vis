import React from "react";
import Layout from "../components/layout";
import BubbleScatter from "../components/bubble-scatter";

export default class extends React.Component {
  render() {
    return (
      <Layout>
        <BubbleScatter width={1000} height={840} />
      </Layout>
    );
  }
}

import React from "react";
import { Zoom, composeMatrices, translateMatrix, scaleMatrix } from "@vx/zoom";
import { scaleLinear, scaleQuantize } from "@vx/scale";
import { Spring, animated } from "react-spring";

const extent = (data, value = d => d) => [
  Math.min(...data.map(value)),
  Math.max(...data.map(value))
];

export default class extends React.PureComponent {
  render() {
    const { width, height, data } = this.props;
    const size = Math.min(width, height);

    const margin = size * 0.075;
    const maxRadius = size * 0.075;

    const colorScale = scaleQuantize({
      domain: extent(data, d => d.freq),
      range: ["#855af2", "#11d2f9", "#49f4e7"]
    });

    const xScale = scaleLinear({
      domain: extent(data, d => d.x),
      range: [(width - size) / 2 + margin, (width - size) / 2 + size - margin]
    });

    const yScale = scaleLinear({
      domain: extent(data, d => d.y),
      range: [(height - size) / 2 + margin, (height - size) / 2 + size - margin]
    });

    const rScale = scaleLinear({
      domain: extent(data, d => Math.sqrt(d.freq)),
      range: [5, maxRadius]
    });

    const center = {
      x: width / 2,
      y: height / 2
    };

    const centerOn = (zoom, { x, y, z = 1 }) => {
      zoom.setTransformMatrix(
        composeMatrices(
          translateMatrix(center.x, center.y),
          scaleMatrix(z, z),
          translateMatrix(-x, -y)
        )
      );
    };

    return (
      <svg width={width} height={height}>
        <Zoom
          width={width}
          height={height}
          scaleXMin={1 / 2}
          scaleXMax={10}
          scaleYMin={1 / 2}
          scaleYMax={10}
        >
          {zoom => {
            return (
              <React.Fragment>
                <rect
                  width={width}
                  height={height}
                  fill="#fff"
                  onClick={() => centerOn(zoom, center)}
                />
                <Spring native to={{ matrix: zoom.toString() }}>
                  {({ matrix }) => {
                    return (
                      <animated.g className="vx-group" transform={matrix}>
                        {data.map((topic, i) => {
                          return (
                            <Spring
                              key={`spring-cir-${i}`}
                              native
                              from={{
                                transform: `translate(${center.x -
                                  xScale(topic.x)} ${center.y -
                                  yScale(topic.y)})`
                              }}
                              to={{ transform: "translate(0 0)" }}
                            >
                              {({ transform }) => (
                                <animated.circle
                                  key={`cir-${i}`}
                                  r={rScale(Math.sqrt(topic.freq))}
                                  cx={xScale(topic.x)}
                                  cy={yScale(topic.y)}
                                  opacity="0.7"
                                  transform={transform}
                                  fill={colorScale(topic.freq)}
                                  onClick={event => {
                                    centerOn(zoom, {
                                      x: xScale(topic.x),
                                      y: yScale(topic.y),
                                      z: Math.min(
                                        5,
                                        (width - 50) /
                                          (2 * rScale(Math.sqrt(topic.freq))),
                                        (height - 50) /
                                          (2 * rScale(Math.sqrt(topic.freq)))
                                      )
                                    });
                                  }}
                                />
                              )}
                            </Spring>
                          );
                        })}
                      </animated.g>
                    );
                  }}
                </Spring>
              </React.Fragment>
            );
          }}
        </Zoom>
      </svg>
    );
  }
}

import { Zoom } from "@vx/zoom";
import { scaleLinear, scaleQuantize } from "@vx/scale";
import { Spring, animated } from "react-spring";

const extent = (data, value = d => d) => [
  Math.min(...data.map(value)),
  Math.max(...data.map(value))
];

export default ({ width, height, data }) => {
  const colorScale = scaleQuantize({
    domain: extent(data, d => d.freq),
    range: ["#ffe108", "#ffc10e", "#fd6d6f", "#855af2", "#11d2f9", "#49f4e7"]
  });

  const xScale = scaleLinear({
    domain: extent(data, d => d.x),
    range: [0, width]
  });

  const yScale = scaleLinear({
    domain: extent(data, d => d.y),
    range: [0, height]
  });

  const rScale = scaleLinear({
    domain: extent(data, d => d.freq),
    range: [0, 100]
  });

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
            <Spring native to={{ matrix: zoom.toString() }}>
              {({ matrix }) => {
                return (
                  <animated.g className="vx-group" transform={matrix}>
                    {data.map((topic, i) => {
                      return (
                        <circle
                          key={`cir-${i}`}
                          r={rScale(topic.freq)}
                          cx={xScale(topic.x)}
                          cy={yScale(topic.y)}
                          fill={colorScale(topic.freq)}
                          onClick={event => {
                            const center = {
                              x: width / 2,
                              y: height / 2
                            };

                            zoom.setTranslate({
                              translateX: center.x - xScale(topic.x),
                              translateY: center.y - yScale(topic.y)
                            });
                          }}
                        />
                      );
                    })}
                  </animated.g>
                );
              }}
            </Spring>
          );
        }}
      </Zoom>
    </svg>
  );
};

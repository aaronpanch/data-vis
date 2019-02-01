import { Zoom } from "@vx/zoom";
import { scaleLinear, scaleLog, scaleQuantize } from "@vx/scale";
import { Spring, animated } from "react-spring";

const extent = (data, value = d => d) => [
  Math.min(...data.map(value)),
  Math.max(...data.map(value))
];

export default ({ width, height, data, margin = 30 }) => {
  const colorScale = scaleQuantize({
    domain: extent(data, d => d.freq),
    range: ["#855af2", "#11d2f9", "#49f4e7"]
  });

  const xScale = scaleLinear({
    domain: extent(data, d => d.x),
    range: [margin, width - margin]
  });

  const yScale = scaleLinear({
    domain: extent(data, d => d.y),
    range: [margin, height - margin]
  });

  const rScale = scaleLinear({
    domain: extent(data, d => d.freq),
    range: [10, 100]
  });

  const center = {
    x: width / 2,
    y: height / 2
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
                          opacity="0.7"
                          fill={colorScale(topic.freq)}
                          onClick={event => {
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

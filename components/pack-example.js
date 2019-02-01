import { Zoom } from "@vx/zoom";
import { Group } from "@vx/group";
import { scaleQuantize } from "@vx/scale";
import { exoplanets as data } from "@vx/mock-data";
import { Spring, animated } from "react-spring";

const extent = (data, value = d => d) => [
  Math.min(...data.map(value)),
  Math.max(...data.map(value))
];

const exoplanets = data.filter(d => d.distance === 0);
const planets = data.filter(d => d.distance !== 0);
const pack = { children: [{ children: planets }].concat(exoplanets) };

const colorScale = scaleQuantize({
  domain: extent(data, d => d.radius),
  range: ["#ffe108", "#ffc10e", "#fd6d6f", "#855af2", "#11d2f9", "#49f4e7"]
});

export default ({ width, height }) => {
  const circles = [
    {
      r: 50,
      x: 300,
      y: 300,
      data: {
        radius: 1000
      }
    }
  ];

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
                    {circles.map((circle, i) => {
                      return (
                        <circle
                          key={`cir-${i}`}
                          r={circle.r}
                          cx={circle.x}
                          cy={circle.y}
                          fill={colorScale(circle.data.radius)}
                          onClick={event => {
                            const center = {
                              x: width / 2,
                              y: height / 2
                            };

                            zoom.setTranslate({
                              translateX: center.x - circle.x,
                              translateY: center.y - circle.y
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

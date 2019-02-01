import { Zoom } from "@vx/zoom";
import { Group } from "@vx/group";
import { Pack } from "@vx/hierarchy";
import { hierarchy } from "d3-hierarchy";
import { scaleQuantize } from "@vx/scale";
import { exoplanets as data } from "@vx/mock-data";
import { Spring } from "react-spring";

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

export default ({
  width,
  height,
  margin = {
    top: 10,
    left: 30,
    right: 40,
    bottom: 80
  }
}) => {
  const data = hierarchy(pack)
    .sum(d => d.radius * d.radius)
    .sort((a, b) => {
      return (
        !a.children - !b.children ||
        isNaN(a.data.distance) - isNaN(b.data.distance) ||
        a.data.distance - b.data.distance
      );
    });

  return (
    <svg width={width} height={height}>
      <Pack root={data} size={[width, height]}>
        {pack => {
          const circles = pack.descendants().slice(2);
          return (
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
                  <Spring to={{ matrix: zoom.toString() }}>
                    {({ matrix }) => {
                      return (
                        <Group transform={matrix}>
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
                        </Group>
                      );
                    }}
                  </Spring>
                );
              }}
            </Zoom>
          );
        }}
      </Pack>
    </svg>
  );
};

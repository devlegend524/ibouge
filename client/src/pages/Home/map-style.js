export const navControlStyle = {
  right: 10,
  bottom: 50,
};
export const getControlStyle = {
  right: 10,
  bottom: 10,
};

export const countiesLayer = {
  id: "user_icon",
  source: "usersIcons",
  type: "circle",
  paint: {
    "circle-radius": 6,
    "circle-color": "#329CEC",
    "circle-opacity": 1,
  },
};
// Highlighted county polygons
export const highlightLayer = {
  id: "counties-highlighted",
  source: "usersIcons",
  type: "circle",
  paint: {
    "circle-radius": 6,
    "circle-color": "#329CEC",
    "circle-opacity": 1,
  },
};

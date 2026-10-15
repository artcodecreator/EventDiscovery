export default {
  routes: [
    { method: "POST", path: "/favorites/toggle", handler: "favorite.toggle", config: { policies: [] } },
    { method: "GET", path: "/favorites/me", handler: "favorite.mine", config: { policies: [] } }
  ]
};

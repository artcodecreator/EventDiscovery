export default {
  routes: [
    { method: "POST", path: "/reviews", handler: "review.create", config: { policies: [] } }
  ]
};

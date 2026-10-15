export default {
  routes: [
    { method: "POST", path: "/events/submit", handler: "event.submit", config: { policies: [] } }
  ]
};

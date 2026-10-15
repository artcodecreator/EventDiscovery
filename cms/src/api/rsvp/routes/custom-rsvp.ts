export default {
  routes: [
    { method: "POST", path: "/rsvps", handler: "rsvp.create", config: { policies: [] } },
    { method: "GET", path: "/rsvps/me", handler: "rsvp.mine", config: { policies: [] } },
    { method: "DELETE", path: "/rsvps/event/:eventDocumentId", handler: "rsvp.cancel", config: { policies: [] } }
  ]
};

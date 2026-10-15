export default ({ env }) => ({
  graphql: { enabled: true, config: { endpoint: "/graphql", shadowCRUD: true, landingPage: env.bool("GRAPHQL_PLAYGROUND", false), depthLimit: 10, defaultLimit: 25, maxLimit: 100 } },
  upload: {
    config: {
      provider: "cloudinary",
      providerOptions: { cloud_name: env("CLOUDINARY_NAME"), api_key: env("CLOUDINARY_KEY"), api_secret: env("CLOUDINARY_SECRET") },
      actionOptions: { upload: {}, uploadStream: {}, delete: {} }
    }
  },
  "users-permissions": { config: { register: { allowedFields: ["phone", "city"] } } }
});

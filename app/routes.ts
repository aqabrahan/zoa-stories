import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("stories/new", "routes/stories.new/route.tsx"),
  route("stories/:id", "routes/stories.$id/route.tsx"),
  route("api/stories/:id/stream", "routes/api.stories.$id.stream/route.ts"),
  route("api/stories/:id/audio", "routes/api.stories.$id.audio/route.ts"),
  route("login", "routes/login/route.tsx"),
  route("library", "routes/library/route.tsx"),
  route("auth/callback", "routes/auth.callback/route.ts"),
] satisfies RouteConfig;

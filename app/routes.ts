import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("stories/new", "routes/stories.new/route.tsx"),
] satisfies RouteConfig;

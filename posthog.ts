import posthog from "posthog-js";

// biome-ignore lint/style/noNonNullAssertion: PostHog key is required for instrumentation to work
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: "https://p.sensory-ui.com",
  ui_host: "https://us.posthog.com",
  defaults: "2026-01-30",
});

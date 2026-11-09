/** @type {import('next').NextConfig} */
const config = {
  // Keep the curated repository instructions under version control.
  agentRules: false,
  // Use one prerender worker in the constrained Windows workspace.
  // Linux CI retains Next's default worker policy.
  ...(process.platform === 'win32' ? { experimental: { cpus: 1, webpackBuildWorker: false, workerThreads: true } } : {}),
};
export default config;

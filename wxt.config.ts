import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react', '@wxt-dev/auto-icons'],
  srcDir: "src",
  manifest: {
    permissions: ["scripting", "tabs", "activeTab", "storage"],
    web_accessible_resources: [{
      resources: ["*.png"],
      matches: ["<all_urls>"],
    }],
  },
  autoIcons: {
    enabled: false,
  }
});

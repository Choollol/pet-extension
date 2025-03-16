import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  srcDir: "src",
  manifest: {
    permissions: ["scripting", "tabs", "activeTab", "storage"],
    web_accessible_resources: ["pet_sprites/*.png"]
  },
});

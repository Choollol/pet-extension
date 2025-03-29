import { MessageType } from "@/utils/message-utils";
import { CURRENT_PET_NAME_KEY } from "@/utils/storage-keys";

export default defineBackground(() => {
  let activeTabId: number;

  const savePetData = () => {
    browser.tabs.sendMessage(activeTabId, { type: MessageType.STORE_PET_DATA });
  }
  
  const updatePetData = async () => {
    const [tab] = await browser.tabs.query({ active: true });
    browser.tabs.sendMessage(activeTabId, { type: MessageType.STORE_PET_DATA });
    browser.tabs.sendMessage(tab.id!, { type: MessageType.LOAD_PET_DATA });
    activeTabId = tab.id!;
  }

  browser.tabs.query({ active: true }).then(([tab]) => {
    activeTabId = tab.id!;
  });

  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    updatePetData();
  });

  browser.tabs.onActivated.addListener(() => {
    updatePetData();
  });

  browser.tabs.onCreated.addListener((tab) => {
    updatePetData();
  });

  console.log('Hello background!', { id: browser.runtime.id });
});

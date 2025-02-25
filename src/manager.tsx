import React from "react";
import { addons, types } from "storybook/internal/manager-api";
import { Tool } from "./components/Tool";
import { ADDON_ID, TAB_ID, TOOL_ID } from "./constants";

/**
 * Note: if you want to use JSX in this file, rename it to `manager.tsx`
 * and update the entry prop in tsup.config.ts to use "src/manager.tsx",
 */

// Register the addon
addons.register(ADDON_ID, (api) => {
  // Register a tool
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: "Kadmos Pdf",
    match: ({ viewMode, tabId }) =>
      !!((viewMode && viewMode.match(/^(story)$/)) || tabId === TAB_ID),
    render: () => <Tool api={api} />,
  });
});

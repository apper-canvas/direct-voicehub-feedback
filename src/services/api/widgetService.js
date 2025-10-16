import widgetConfigsData from "@/services/mockData/widgetConfigs.json";

let widgetConfigs = [...widgetConfigsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const widgetService = {
  async getAll() {
    await delay(200);
    return [...widgetConfigs];
  },

  async getById(id) {
    await delay(200);
    const config = widgetConfigs.find(w => w.Id === parseInt(id));
    if (!config) {
      throw new Error("Widget configuration not found");
    }
    return { ...config };
  },

  async create(configData) {
    await delay(400);
    const newConfig = {
      ...configData,
      Id: Math.max(...widgetConfigs.map(w => w.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    widgetConfigs.push(newConfig);
    return { ...newConfig };
  },

  async update(id, configData) {
    await delay(400);
    const index = widgetConfigs.findIndex(w => w.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Widget configuration not found");
    }
    
    widgetConfigs[index] = {
      ...widgetConfigs[index],
      ...configData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...widgetConfigs[index] };
  },

  async delete(id) {
    await delay(300);
    const index = widgetConfigs.findIndex(w => w.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Widget configuration not found");
    }
    
    const deletedConfig = widgetConfigs.splice(index, 1)[0];
    return { ...deletedConfig };
  },

  async generateEmbedCode(config, framework = "html") {
    await delay(100);
    
    const projectId = "YOUR_PROJECT_ID"; // Would be replaced with actual project ID
    const apiKey = "YOUR_PUBLIC_API_KEY"; // Would be replaced with actual API key

    if (framework === "html") {
      return `<!-- Feedback Widget - Copy this code before closing </body> tag -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://cdn.yourapp.com/widget/v1/feedback.js';
    script.async = true;
    script.setAttribute('data-project-id', '${projectId}');
    script.setAttribute('data-api-key', '${apiKey}');
    script.setAttribute('data-position', '${config.position}');
    script.setAttribute('data-color', '${config.buttonColor}');
    script.setAttribute('data-text', '${config.buttonText}');
    script.setAttribute('data-icon', '${config.iconName}');
    script.setAttribute('data-size', '${config.size}');
    document.body.appendChild(script);
  })();
</script>`;
    }

    if (framework === "react") {
      return `// Install: npm install @yourapp/feedback-widget

import { FeedbackWidget } from '@yourapp/feedback-widget';

function App() {
  return (
    <>
      {/* Your app components */}
      
      <FeedbackWidget
        projectId="${projectId}"
        apiKey="${apiKey}"
        position="${config.position}"
        buttonColor="${config.buttonColor}"
        buttonText="${config.buttonText}"
        iconName="${config.iconName}"
        size="${config.size}"
      />
    </>
  );
}

export default App;`;
    }

    if (framework === "vue") {
      return `<!-- Install: npm install @yourapp/feedback-widget -->

<template>
  <div id="app">
    <!-- Your app components -->
    
    <FeedbackWidget
      :project-id="'${projectId}'"
      :api-key="'${apiKey}'"
      :position="'${config.position}'"
      :button-color="'${config.buttonColor}'"
      :button-text="'${config.buttonText}'"
      :icon-name="'${config.iconName}'"
      :size="'${config.size}'"
    />
  </div>
</template>

<script>
import { FeedbackWidget } from '@yourapp/feedback-widget';

export default {
  components: {
    FeedbackWidget
  }
};
</script>`;
    }

    return "";
  }
};
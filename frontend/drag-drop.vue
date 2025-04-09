<template>
  <div class="builder-container">
    <h3>Page Builder</h3>
    <div class="component-panel">
      <h4>Components</h4>
      <div class="library">
        <button draggable="true" @dragstart="dragStart('Text', $event)" class="component-item">
          <span class="icon">T</span> Text Block
        </button>
        <button draggable="true" @dragstart="dragStart('Button', $event)" class="component-item">
          <span class="icon">B</span> Button
        </button>
        <button draggable="true" @dragstart="dragStart('Image', $event)" class="component-item">
          <span class="icon">I</span> Image
        </button>
      </div>
    </div>
    
    <div 
      class="preview" 
      @drop="drop($event)" 
      @dragover.prevent
      @dragenter="dragEnter($event)"
    >
      <div v-if="items.length === 0" class="empty-state">
        Drag and drop components here to build your page
      </div>
      <div 
        v-for="(item, index) in items" 
        :key="index"
        class="dropped-component"
        :class="{ 'component-text': item.type === 'Text', 'component-button': item.type === 'Button', 'component-image': item.type === 'Image' }"
        :style="{ top: item.top + 'px', left: item.left + 'px' }"
        draggable="true"
        @dragstart="dragExisting(index, $event)"
      >
        <component-renderer :type="item.type" />
        <div class="component-controls">
          <button @click="removeItem(index)" class="control-button">×</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    ComponentRenderer: {
      props: ['type'],
      render(h) {
        switch(this.type) {
          case 'Text':
            return h('div', { class: 'text-component' }, 'Sample Text Block');
          case 'Button':
            return h('button', { class: 'button-component' }, 'Button');
          case 'Image':
            return h('div', { class: 'image-component' }, 'Image Placeholder');
          default:
            return h('div', 'Unknown Component');
        }
      }
    }
  },
  data() {
    return {
      items: [],
      draggedIndex: null
    };
  },
  methods: {
    dragStart(type, event) {
      event.dataTransfer.setData("component-type", type);
      event.dataTransfer.effectAllowed = "copy";
    },
    dragExisting(index, event) {
      event.dataTransfer.setData("component-index", index);
      this.draggedIndex = index;
      event.dataTransfer.effectAllowed = "move";
    },
    dragEnter(event) {
      event.preventDefault();
      event.target.classList.add('drag-over');
    },
    drop(event) {
      event.preventDefault();
      
      const componentType = event.dataTransfer.getData("component-type");
      const componentIndex = event.dataTransfer.getData("component-index");
      
      // Get coordinates relative to the preview area
      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Moving existing component
      if (componentIndex !== "") {
        const index = parseInt(componentIndex);
        this.items[index].top = y;
        this.items[index].left = x;
        return;
      }
      
      // Adding new component
      if (componentType) {
        this.items.push({
          type: componentType,
          top: y,
          left: x
        });
      }
      
      // Remove drag-over styling
      event.target.classList.remove('drag-over');
    },
    removeItem(index) {
      this.items.splice(index, 1);
    }
  }
};
</script>

<style scoped>
.builder-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: Arial, sans-serif;
}

.component-panel {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 5px;
}

.library {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.component-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: grab;
  transition: all 0.2s;
}

.component-item:hover {
  background: #eee;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #e1e1e1;
  border-radius: 4px;
  font-weight: bold;
}

.preview {
  position: relative;
  min-height: 400px;
  border: 2px dashed #ccc;
  padding: 20px;
  background: #fafafa;
  border-radius: 5px;
}

.preview.drag-over {
  background: #f0f8ff;
  border-color: #4da6ff;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #999;
  font-style: italic;
}

.dropped-component {
  position: absolute;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  min-width: 100px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  cursor: move;
}

.component-controls {
  position: absolute;
  top: -10px;
  right: -10px;
  display: none;
}

.dropped-component:hover .component-controls {
  display: block;
}

.control-button {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #ff5555;
  color: white;
  border: none;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-button:hover {
  background: #ff3333;
}

.component-text {
  min-width: 200px;
}

.component-button {
  min-width: 120px;
}

.component-image {
  min-width: 150px;
  min-height: 100px;
}

.text-component {
  padding: 5px;
  min-height: 20px;
}

.button-component {
  padding: 8px 16px;
  background: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.image-component {
  height: 80px;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #ccc;
}
</style>
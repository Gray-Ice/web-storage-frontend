<script setup lang="js">
import Editor from "./components/editor.vue";
</script>

<template>
  <a-layout class="layout-demo">
    <a-layout-header>
    </a-layout-header>
    <a-layout-content>
      <Editor></Editor>
    </a-layout-content>
    <a-layout-footer>
    </a-layout-footer>
  </a-layout>
</template>

<style scoped lang="less">
.layout-demo {
  //height: 500px;
  background: var(--color-fill-2);
  border: 1px solid var(--color-border);
}

.layout-demo :deep(.arco-layout-sider) .logo {
  height: 32px;
  margin: 12px 8px;
  background: rgba(255, 255, 255, 0.2);
}

.layout-demo :deep(.arco-layout-sider-light) .logo {
  background: var(--color-fill-2);
}

.layout-demo :deep(.arco-layout-header) {
  //height: 64px;
  //line-height: 64px;
  background: var(--color-bg-3);
}

.layout-demo :deep(.arco-layout-footer) {
  height: 48px;
  color: var(--color-text-1);
  font-weight: 400;
  font-size: 14px;
  line-height: 48px;
}

.layout-demo :deep(.arco-layout-content) {
  color: var(--color-text-1);
  font-weight: 400;
  font-size: 14px;
  background: var(--color-bg-3);
}

.layout-demo :deep(.arco-layout-footer),
.layout-demo :deep(.arco-layout-content) {
  //display: flex;
  //flex-direction: column;
  //justify-content: center;
  color: var(--color-text-1);
  font-size: 16px;
  font-stretch: condensed;
  //text-align: center;
}

</style>

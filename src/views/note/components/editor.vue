<script setup lang="js">
import Vditor from "vditor";
import 'vditor/dist/index.css'
import {onMounted, ref, reactive} from "vue";
import {useRecordStore} from "@/store"
import {uploadMarkdownNote} from "@/api/note";
import {Message} from "@arco-design/web-vue";

const props = defineProps(['text', 'date', 'filename'])
const date = ref()
const filename = ref("")
const text = ref("")
const vditor = ref();
const info = ref({autoSave: false, saving: false})
const record = useRecordStore()

if (typeof props.date === 'undefined') {
  date.value = new Date().toISOString().split('T')[0]
} else {
  date.value = props.date
}
if (typeof filename === 'undefined') {
  filename.value = "default"
} else {
  filename.value = props.filename
}
if (typeof text === 'undefined') {
  text.value = ''
} else {
  text.value = props.text
}


onMounted(() => {
  vditor.value = new Vditor('vditor', {
    height: 500,
    placeholder: text,
    theme: "classic",
  })
})

async function onSave() {
  let text = vditor.value.getValue()
  info.value.saving = true
  let resp;
  try {
    resp = await uploadMarkdownNote(date.value, filename.value, text, true)
  } catch (e) {
    Message.error({content: `when upload markdown note: ${e}`})
    info.value.saving = false
    return
  }
  info.value.saving = false
  Message.success({content: resp.msg})
  console.log(`Date is ${date.value}; filename is: ${filename.value}.text is: ${text}`)
}
</script>

<template>
  <a-space fill>
    <a-button @click="ev => console.log(vditor.getValue())">Show Text</a-button>
    <a-date-picker style="width: 200px;" v-model="date"/>
    <a-input v-model="filename">
      <template #prepend>
        Filename
      </template>
      <template #append>
        .md
      </template>
    </a-input>
    <a-checkbox v-model="record.autoSave" @change="value => {record.setAutoSave(value === true); }">AutoSave
    </a-checkbox>
    <a-button type="primary" status="normal" :loading="info.saving" @click="onSave">Save</a-button>
  </a-space>
  <div>

    <div id="vditor"></div>
  </div>
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
<script setup lang="js">
import Vditor from "vditor";
import 'vditor/dist/index.css'
import {onMounted, ref, reactive, watch} from "vue";
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

if (typeof props.filename === 'undefined') {
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
    theme: "classic",
    value: text.value,
    image: {
      isPreview: true
    },
    cache: {
      enable: false
    }

  })
  watch(()=>props.filename, (newName, _)=>{filename.value = newName;})
  watch(()=>props.date, (newDate, _)=>{date.value = newDate;})
  watch(()=>props.text, (newText, _)=>{text.value = newText; vditor.value.setValue(newText)})
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
  <div>
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
  </div>
</template>

<style scoped lang="less">
</style>

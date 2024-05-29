<script setup lang="js">
import Vditor from "vditor";
import 'vditor/dist/index.css'
import {onMounted, ref, reactive, watch, onUpdated} from "vue";
import {useRecordStore} from "@/store"
import {checkNoteExists, uploadMarkdownNote, uploadFile} from "@/api/note";
import {Message} from "@arco-design/web-vue";
import {getToken} from "@/utils/auth"
import {viewDepthKey} from "vue-router";

const props = defineProps(['text', 'date', 'filename', 'currentPath'])
const date = ref()
const filename = ref("")
const text = ref("")
const currentPath = ref("")
const savedNote = ref(false)
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


/* TODO: 该编辑器可能在两个地方打开，
    一个是新建Note, 一个是编辑已存在的Note, 但是新建Note的时候我们是不知道这个文件的位置的，所以要让用户先保存Note再上传为文件。
自定义上传图片的处理函数
 */
// We can only handle upload one image now
async function handleUploadImages(files){
  console.log("Handlign upload image")
  let form = new FormData()
  form.append("file", files[0])
  if(currentPath.value === "" || currentPath.value === undefined || currentPath.value === null){
    Message.warning({content: "You must save file before you upload images,\n because this note haven't be created,\n so it can't have its own images.", duration: 10 * 1000})
    return Promise.reject("You must save file before you upload images,\n because this note haven't be created,\n so it can't have its own images.")
  }

  console.log(currentPath.value)
  // return Promise.resolve()
  let resp = null
  try{
    resp = await uploadFile(files[0], currentPath.value, "")
  } catch (e){
    Message.error({content: `${e}`})
  }

  if(resp === null){
    Message.error({content: "Upload file failed"})
    return
  }
  if (resp.code !== 200){
    Message.error({content: resp.msg})
    return
  }
  console.log(`Code is: ${resp.code}`)
  Message.success({content: "upload file success"})
  let image_path = `${import.meta.env.VITE_API_BASE_URL}${resp.path}`
  let tag = `<img src="${image_path}" />`
  let vText = vditor.value.getValue()
  console.log(tag)
  vText = `${vText}\n${tag}\n`
  vditor.value.setValue(vText)
}
async function autoGetText(){
  if(filename.value === "" || typeof date.value === 'undefined' ||date.value === ""){
    return
  }
  checkNoteExists(date.value, filename.value, true).then((res)=>{
    // code equal 202 means we can use the text returned with the response
    if(res.code === 202){
      text.value = res.text
      vditor.value.setValue(res.text)
      currentPath.value = res.path
      console.log(currentPath.value)
    }
  })
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
    },
    upload: {
      url: `${import.meta.env.VITE_API_BASE_URL}/notes/upload_file`,
      handler: handleUploadImages,
    },
    after() {
      autoGetText()
    }
  })

  watch(()=>props.filename, (newName, _)=>{filename.value = newName;})
  watch(()=>props.date, (newDate, _)=>{date.value = newDate;})
  watch(()=>props.text, (newText, _)=>{text.value = newText; vditor.value.setValue(newText)})
  watch(()=>props.currentPath, (newText, _)=>{currentPath.value = newText;})
})


async function onSave() {
  let text = vditor.value.getValue()
  info.value.saving = true
  let resp;
  try {
    resp = await uploadMarkdownNote(date.value, filename.value, text, true, false)
  } catch (e) {
    Message.error({content: `when upload markdown note: ${e}`})
    info.value.saving = false
    return
  }
  info.value.saving = false
  if(resp.code === 200){
    Message.success({content: resp.msg})
    currentPath.value = resp.path
    return
  } else if(resp.code === 202){
    if(resp.text !== null && typeof resp.path !== 'undefined'){
      Message.info({content: "Loaded file content from server", duration: 5 * 1000})
      vditor.value.setValue(resp.text)
    }
    if(resp.path !== null && typeof resp.path !== 'undefined'){
      currentPath.value = resp.path
    }
  }
  // alert("Something")
  // alert(`The path of res.path is: ${resp.path}`)
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

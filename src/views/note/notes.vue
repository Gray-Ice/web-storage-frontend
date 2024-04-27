<script setup lang="js">
// import {getFiles, uploadFile} from "@/api/file"
import {getNotes, checkNoteExists, deleteFile} from "@/api/note";
import {customRef, onMounted, ref} from "vue";
import {Message} from "@arco-design/web-vue";
import {getToken} from '@/utils/auth'
import Editor from "./components/editor.vue"

const showUploadFilesWithDrag = ref(false)
const currentPath = ref("")
const dirs = ref([])
const host = import.meta.env.VITE_API_BASE_URL
const token = ref("")
const drawerHeight = ref(250)
const editingInfo = ref({filename: "", text: "", date: "", visible: false})
token.value = getToken()


const setClipboard = async function (text) {
  await navigator.clipboard.writeText(text).then(() => {
        Message.success({content: "Copy success"})
      },
      () => {
        Message.error({content: "Copy failed"})
      }
  )
}

const copyLink = async function (fullPath) {
  let fullText = `${host}/${fullPath}`
  await setClipboard(fullText)
}


const updateNotesByRequestBackend = async function (path) {
  try {
    let fileResponse = await getNotes(path)
    dirs.value = fileResponse.dirs
    currentPath.value = fileResponse.root
    return true
  } catch (e) {
    console.log(`Request notes from backend failed: ${e}`)
    return false
  }
}

const addPath = async function (path) {
  let backupCurrentPath = currentPath.value
  if (currentPath.value[currentPath.value.length - 1] !== "/") {
    currentPath.value = `${currentPath.value}/`
  }
  currentPath.value = `${currentPath.value}${path}`
  let success = await setPath(currentPath.value)
  if (!success) {
    Message.error({content: `Can not access ${currentPath.value}. Go back to ${backupCurrentPath}`})
  }
}

const setPath = async function (path) {
  if (path[path.length - 1] !== "/") {
    path = `${path}/`
  }
  let success = await updateNotesByRequestBackend(path)
  if (!success) {
    return false
  }
  currentPath.value = path
  return true
}

const gotoLastFolder = async function () {
  let path = currentPath.value
  if (path === "/") {
    return
  }
  let paths = path.split("/")
  if (path.length === 0) {
    return
  }

  let tempPath = ""
  for (let i = 1; i < paths.length - 2; i++) {
    let currentSlicePath = paths[i]
    tempPath = `${tempPath}/${currentSlicePath}`
  }

  if (tempPath === "") {
    tempPath = "/"
  }
  console.log(tempPath)
  await setPath(tempPath)
}

async function editExistingNote(filename) {
  if (filename.length <= 3 || !filename.endsWith(".md")) {
    Message.error({content: `Can't edit ${filename}, edit is only support to edit .md file`, duration: 5000})
    return
  }
  let path = currentPath.value
  let pathSlices = path.split("/")
  let date = `${pathSlices[1]}-${pathSlices[2]}-${pathSlices[3]}`
  let resp = undefined;
  try {
    resp = await checkNoteExists(date, filename, true)
  } catch (e) {
    Message.error({content: `When fetching file, got error: ${e}`, duration: 5000})
    return
  }

  let filenameToEditor = ""
  for (let i = 0; i < filename.length - 3; i++) {
    filenameToEditor += filename[i]
  }
  editingInfo.value.filename = filenameToEditor
  editingInfo.value.text = resp.text
  editingInfo.value.date = date
  editingInfo.value.visible = true
}

function onStopEdit() {
  editingInfo.value.text = ""
  editingInfo.value.filename = ""
  editingInfo.value.visible = false
}

async function deleteFileUnderPath(filename){
  let path;
  if(currentPath.value === "/"){
    path = `${currentPath.value}${filename}`
  } else {
    path = `${currentPath.value}/${filename}`
  }
  let resp = null;
  try{
    resp = await deleteFile(path)
  } catch (e){
    return
  }
  await setPath(currentPath.value)
  Message.success({content: `${resp.msg}`})
}

onMounted(async () => {
  setPath("")
  drawerHeight.value = window.screen.height * 0.7
})
const example = ref([1, 2, 3])
</script>

<template>
  <a-layout class="layout-demo">
    <!--    <a-layout-sider>-->
    <!--      something-->
    <!--    </a-layout-sider>-->
    <a-drawer
        :visible="editingInfo.visible"
        placement="top"
        :esc-to-close="false"
        :height="drawerHeight"
        @cancel="onStopEdit"
        @ok="onStopEdit"
        ok-text="Close"
        :hide-cancel="true"
    >
      <Editor :filename="editingInfo.filename" :date="editingInfo.date" :text="editingInfo.text"/>
    </a-drawer>
    <a-modal v-model:visible="showUploadFilesWithDrag" @ok="e => showUploadFilesWithDrag = false"
             @cancel="e => showUploadFilesWithDrag = false">
      <template #title>
        Upload files with drag
      </template>
      <div>
        <a-upload draggable multiple
                  :action="host + '/notes/upload_file'"
                  :headers="{authorization: 'Something' + ' ' + token}"
                  :data="{'path': currentPath}"
        >
        </a-upload>
      </div>
    </a-modal>
    <a-layout-header>
      <h1>Manage Files</h1>
    </a-layout-header>
    <a-layout-content>
      <!--      <p>Curren Path: {{currentPath}}</p>-->
      <!--      <div v-for="file in dirs">-->
      <!--        <p>{{file.name}}</p>-->
      <!--      </div>-->
      <a-list>
        <template #header>
          <div style="position: relative; left: 0; top: 0; padding: 2rem">
            <div style="position: absolute; left: 0; top: 0">
              Current Path: {{ currentPath }}
              <a-button @click="setPath(currentPath)" type="primary">Refresh</a-button>
            </div>
            <div style="position: absolute; right: 0; top: 0">
              <a-space>
                <a-button type="primary" status="normal" @click="gotoLastFolder">Back to last folder</a-button>
                <!--                <a-button type="primary" status="success">Upload File</a-button>-->
                <a-upload
                    :action="host + '/notes/upload_file'"
                    :headers="{authorization: 'Something' + ' ' + token}"
                    :data="{'path': currentPath}"
                    @success="()=>setPath(currentPath)"
                ></a-upload>
                <a-button type="primary" status="success" @click="()=>showUploadFilesWithDrag = true">Upload with drag
                </a-button>
              </a-space>
            </div>
          </div>
        </template>

        <a-list-item v-for="file in dirs">
          <a-list-item-meta :title="file.name" :description='file.dir?"Dir":"File"'>
          </a-list-item-meta>
          <template #actions>
            <a-space>
              <a-popconfirm :content="`Do you really want to delete ${file.name}`" ok-text="Delete" cancel-text="No" position="left" @ok="deleteFileUnderPath(file.name)">
                  <a-button type="primary" status="danger">
                  <template #icon>
                    <icon-delete/>
                  </template>
                </a-button>
              </a-popconfirm>
              <a-button type="primary" status="normal" v-if="file.dir" @click="addPath(file.name)">
                <icon-folder/>
              </a-button>
              <a-button type="primary" status="normal" v-else @click="copyLink(file.path)">
                <icon-attachment/>
              </a-button>
              <a-button type="primary" status="normal" v-else @click="editExistingNote(file.name)">
                <icon-edit/>
              </a-button>

            </a-space>
          </template>
        </a-list-item>
      </a-list>
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

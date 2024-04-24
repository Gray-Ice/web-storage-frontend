import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import {Form} from "@arco-design/web-vue";

export interface GetFileResult {
    dirs: string[]
}

export function getFiles(root: String) {
    return axios.get<GetFileResult>(`/files/get_files?root=${root}`);
}

export function uploadFile(file: File, path: string, name: string){
    let form : FormData = new FormData();
    form.append("file", file)
    form.append("path", path)
    form.append("name", name)
    return axios.post("/files/upload_file", form)
}

export function deleteFile(path: String) {
    return axios.get(`/files/delete?path=${path}`);
}

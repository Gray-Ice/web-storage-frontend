import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import {Form} from "@arco-design/web-vue";
import {over} from "lodash";

export interface LoginData {
    username: string;
    password: string;
}

export interface UploadMarkdownNoteResult {
    code: number
    msg: string
}

export function uploadMarkdownNote(date: string, filename: string, text: string, overwrite: boolean = false){
    return axios.post<UploadMarkdownNoteResult>("/notes/upload_note", {date: date, filename: filename, text: text, overwrite: overwrite})
}

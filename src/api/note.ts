import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import {Form} from "@arco-design/web-vue";
import {over} from "lodash";
import app from "@/store/modules/app";

export interface LoginData {
    username: string;
    password: string;
}

export interface UploadMarkdownNoteResult {
    code: number
    msg: string
}

export function uploadMarkdownNote(date: string,
                                   filename: string,
                                   text: string,
                                   overwrite: boolean = false,
                                   withTextIfExists: boolean = false,
){
    return axios.post<UploadMarkdownNoteResult>("/notes/upload_note", {date: date, filename: filename, text: text, overwrite: overwrite, back_with_text: withTextIfExists})
}

export interface GetFileResult {
    dirs: string[]
}

export function getNotes(root: string) {
    return axios.get<GetFileResult>(`/notes/get_notes?root=${root}`);
}

export interface CheckNoteExistsResult{
    code: Number
    msg: string
    text?: string
}
export function checkNoteExists(date: string,
                                filename: string,
                                getText: boolean = false) {
    return axios.get<CheckNoteExistsResult>(`/notes/check_note_exists?date=${date}&filename=${filename}&get_text=${getText}`);
}

export function deleteFile(path: string) {
    return axios.post("/notes/delete", {path: path})
}

export function uploadFile(file: File, path: string, name: string = ""){
    let form = new FormData()
    form.append("file", file)
    form.append("path", path)
    form.append("name", name)
    return axios.post("/notes/upload_file", form)

}

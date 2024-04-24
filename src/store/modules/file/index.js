import {defineStore} from "pinia";
import {getFiles} from "../../../api/file"

const useFileStore = defineStore('file', {
    state: () => {
        return {
            currentPath: ""
        }
    },
    actions: {

    }
})

export default useFileStore;

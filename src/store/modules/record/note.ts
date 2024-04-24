import {defineStore} from "pinia";

const markdownAutoSaveKey: string = "markdownAutoSave"
const useRecordStore = ()=>{
    // when use useRecordStore, init it.
    const innerState = defineStore('record', {
        state: () => {
            return {
                autoSave: false,
            }
        },
        actions: {
            getAutoSave(): boolean {
                let status = localStorage.getItem(markdownAutoSaveKey)
                if (status === null || status === "0") {
                    return false
                } else if (status === "1"){
                    return true
                }
                return false
            },
            setAutoSave(save: boolean) {
                console.log(save)
                this.$patch({autoSave: save})
                if(save){
                    localStorage.setItem(markdownAutoSaveKey, "1")
                } else {
                    localStorage.setItem(markdownAutoSaveKey, "0")
                }
            }

        }
    })

    const s = innerState()
    s.autoSave = s.getAutoSave()
    return s
}

export default useRecordStore;

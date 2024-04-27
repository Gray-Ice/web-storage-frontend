import { createPinia } from 'pinia';
import useAppStore from './modules/app';
import useUserStore from './modules/user';
import useTabBarStore from './modules/tab-bar';
import useRecordStore from "@/store/modules/record/note";

const pinia = createPinia();

export { useAppStore, useUserStore, useTabBarStore, useRecordStore};
export default pinia;

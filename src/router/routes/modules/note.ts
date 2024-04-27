import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const Note: AppRouteRecordRaw = {
    path: '/note',
    name: 'Note',
    component: DEFAULT_LAYOUT,
    // component: ()=> {return import ('@/views/file/index.vue')},
    meta: {
        locale: 'menu.record',
        requiresAuth: true,
        // icon: 'icon-dashboard',
    },
    children: [
        {
            path: 'markdown',
            name: 'markdown',
            component: () => import('@/views/note/index.vue'),
            meta: {
                locale: 'menu.note.write',
                requiresAuth: true,
                roles: ['*'],
                // activeMenu: true,
            },
        },
        {
            path: 'notes',
            name: 'notes',
            component: () => import('@/views/note/notes.vue'),
            meta: {
                locale: 'menu.note.files',
                requiresAuth: true,
                roles: ['*'],
                // activeMenu: true,
            },
        },
    ],
};

export default Note;

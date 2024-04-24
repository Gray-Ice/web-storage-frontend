import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const File: AppRouteRecordRaw = {
    path: '/notes',
    name: 'Notes',
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
            component: () => import('@/views/notes/index.vue'),
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
            component: () => import('@/views/notes/notes.vue'),
            meta: {
                locale: 'menu.note.files',
                requiresAuth: true,
                roles: ['*'],
                // activeMenu: true,
            },
        },
    ],
};

export default File;

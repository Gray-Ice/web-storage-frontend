import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const File: AppRouteRecordRaw = {
    path: '/file',
    name: 'File',
    component: DEFAULT_LAYOUT,
    // component: ()=> {return import ('@/views/file/index.vue')},
    meta: {
        locale: 'menu.file',
        requiresAuth: true,
        // icon: 'icon-dashboard',
    },
    children: [
        {
            path: 'manage',
            name: 'manage',
            component: () => import('@/views/file/index.vue'),
            meta: {
                locale: 'menu.file.manage',
                requiresAuth: true,
                roles: ['*'],
                // activeMenu: true,
            },
        },
    ],
};

export default File;

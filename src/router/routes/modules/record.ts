import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const File: AppRouteRecordRaw = {
    path: '/record',
    name: 'Record',
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
            component: () => import('@/views/record/index.vue'),
            meta: {
                locale: 'menu.record.markdown',
                requiresAuth: true,
                roles: ['*'],
                // activeMenu: true,
            },
        },
    ],
};

export default File;

import { createRouter, createWebHistory } from "vue-router";

import CoachesList from './pages/coaches/CoachesList.vue';
import CoachRegistration from './pages/coaches/CoachRegistration.vue';
import CoachDetail from './pages/coaches/CoachDetail.vue';
import ContactCoach from './pages/requests/ContactCoache.vue';
import RequestsReceived from './pages/requests/RequestsReceived.vue';
import NotFound from './pages/NotFound.vue';
import UserAuth from './pages/auth/UserAuth.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/coaches' },
        { path: '/coaches', component: CoachesList },
        { 
            path: '/coaches/:id', 
            component: CoachDetail, 
            props: true,
            children: [
                { path: 'contact', component: ContactCoach }
        ]},
        { path: '/requests', component: RequestsReceived },
        { path: '/register', component: CoachRegistration },
        { path: '/auth', component: UserAuth },
        { path: '/:notFound(.*)', component: NotFound },
    ]
});

export default router;
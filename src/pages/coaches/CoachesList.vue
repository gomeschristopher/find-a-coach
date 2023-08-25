<template>
    <div>
        <BaseDialog :show="!!error" title="An error ocurred!" @close="handleError">
        <p>{{ error }}</p>
        </BaseDialog>
        <section>
            <CoachFilter @change-filter="setFilters" />
        </section>
        <section> 
        <BaseCard>
            <div class="controls">
                <BaseButton @click="loadCoaches(true)" mode="outline">Refresh</BaseButton>
                <BaseButton link to="/auth" v-if="!isLoggedIn">Login</BaseButton>
                <BaseButton v-if="!isCoach && !isLoading && isLoggedIn" link to="/register">Register as Coach</BaseButton>
            </div>
            <div v-if="isLoading">
                <BaseSpinner />
            </div>
            <ul v-else-if="hasCoaches">
                <CoachItem 
                    v-for="coach in filteredCoaches" 
                    :key="coach.id"
                    :id="coach.id"
                    :first-name="coach.firstName"
                    :last-name="coach.lastName"
                    :rate="coach.hourlyRate"
                    :areas="coach.areas">
                    {{ coach.firstName }}
                </CoachItem>
            </ul>
            <h3 v-else>No coaches found.</h3>
        </BaseCard>
        </section>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

import CoachItem  from '../../components/coaches/CoachItem.vue';
import CoachFilter from '../../components/coaches/CoachFilter.vue';

export default {
    components: {
        CoachItem,
        CoachFilter
    },
    setup() {
        const isLoading = ref(false);
        const error = ref(null);
        const activeFilters = ref({
            frontend: true,
            backend: true,
            carreer: true
        });
        const store = useStore();

        const isLoggedIn = computed(() => {
            return store.getters.isAuthenticated;
        });

        const filteredCoaches = computed(() => {
            const coaches = store.getters['coaches/coaches'];
            return coaches.filter(coach => {
                if(activeFilters.value.frontend && coach.areas.includes('frontend')) {
                    return true;
                }
                if(activeFilters.value.backend && coach.areas.includes('backend')) {
                    return true;
                }
                if(activeFilters.value.career && coach.areas.includes('career')) {
                    return true;
                }
                return false;
            });
        });

        const hasCoaches = computed(() => {
            return !isLoading.value && store.getters['coaches/hasCoaches'];
        });

        const isCoach = computed(() => {
            return store.getters['coaches/isCoach'];
        }); 

        const setFilters = updatedFilters => {
            activeFilters.value = updatedFilters;
        };

        const loadCoaches = async (refresh = false) => {
            isLoading.value = true;
            try {
                await store.dispatch('coaches/loadCoaches', { forceRefresh: refresh });
            } catch (err) {
                error.value = err.message || 'Something went wrong';
            }
            isLoading.value = false;
        };

        const handleError = async () => {
            this.error.value = null;
        }

        onMounted(() => {
            loadCoaches();
        })

        return {
            isLoading,
            error, 
            activeFilters,
            isLoggedIn,
            filteredCoaches,
            hasCoaches,
            isCoach,
            setFilters,
            loadCoaches,
            handleError
        }
    }
}
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>
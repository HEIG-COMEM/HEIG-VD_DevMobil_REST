import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useFetchApi } from '@/composables/useFetchApi';

export const usePublicationsStore = defineStore('publications', () => {
  const userStore = useUserStore();
  const { fetchApi } = useFetchApi(import.meta.env.VITE_API_URL, {
    Authorization: `Bearer ${userStore.getToken}`,
  });

  const publications = ref({
    data: [],
    metas: null,
  });

  const page = ref(1);
  const hasMore = ref(false);
  const loading = ref(false);

  const _fetchPublications = async (page = 1, pageSize = 2) => {
    loading.value = true;
    const { data, headers } = await fetchApi({
      url: `/publications?page=${page}&pageSize=${pageSize}`,
    });

    publications.value = {
      data: [...publications.value.data, ...data],
      metas: headers,
    };

    hasMore.value = headers['pagination-total'] > page;
    loading.value = false;
  };

  const loadCurrentPublications = async () => {
    await _fetchPublications(page.value);
  };

  const getPublications = computed(() => {
    if (publications.value.data.length === 0) loadCurrentPublications()
    return publications.value;
  });
  const isLoading = computed(() => loading.value);

  const loadMorePublications = async () => {
    if (hasMore.value) {
      page.value++;
      await loadCurrentPublications();
    }
  }

  const $reset = () => {
    publications.value = {
      data: [],
      metas: null,
    };
    page.value = 1;
    hasMore.value = false;
    loading.value = false;
  }

  return {
    getPublications,
    isLoading,
    loadMorePublications,
    $reset,
  };
});

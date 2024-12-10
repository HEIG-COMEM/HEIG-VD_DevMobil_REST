<script setup>
import AppPublicationCard from '@/components/AppPublicationCard.vue';

const publications =  
[
    {
        frontCamera: {
            url: "https://res.cloudinary.com/dsfssjubh/image/upload/v1732885563/isc3jukedh3keuqgx0r8.webp",
            id: "front-camera-1"
        },
        backCamera: {
            url: "https://res.cloudinary.com/dsfssjubh/image/upload/v1732885566/tjrsabmoxgtlpckjxokb.webp",
            id: "back-camera-1"
        },
        _id: "6756e6cfd5f5a9f70111628d",
        location: {
            type: "Point",
            coordinates: [
                -83.3374,
                -87.2508
            ],
        },
        user: {
            _id: "6756e6cfd5f5a9f70111626b",
            name: "John Doe",
        },
        createdAt: "2024-12-09T12:47:11.730Z",
        updatedAt: "2024-12-09T12:47:11.730Z"
    },
    {
        frontCamera: {
            url: "https://res.cloudinary.com/dsfssjubh/image/upload/v1732885555/jbe5dsij4qt9mlksosj9.webp",
            id: "front-camera-2"
        },
        backCamera: {
            url: "https://res.cloudinary.com/dsfssjubh/image/upload/v1732885558/gbj23ukc1m19ph1wzhmj.webp",
            id: "back-camera-2"
        },
        _id: "6756e6cfd5f5a9f701116290",
        location: {
            type: "Point",
            coordinates: [
                91.2455,
                35.5192
            ],
        },
        user: {
            _id: "6756e6cfd5f5a9f70111626e",
            name: "Sarah Connor",
        },
        createdAt: "2024-12-09T12:47:11.732Z",
        updatedAt: "2024-12-09T12:47:11.732Z"
    },
    {
        frontCamera: {
            url: "https://res.cloudinary.com/dsfssjubh/image/upload/v1732885548/p7uk5ioet3dx3g7aicod.webp",
            id: "front-camera-3"
        },
        backCamera: {
            url: "https://res.cloudinary.com/dsfssjubh/image/upload/v1732885552/zrkhc4ivlz627q4tnn3v.webp",
            id: "back-camera-3"
        },
        _id: "6756e6cfd5f5a9f701116293",
        location: {
            type: "Point",
            coordinates: [
                -137.0285,
                6.2541
            ],
        },
        user: {
            _id: "6756e6cfd5f5a9f701116270",
            name: "Steve Prompt",
        },
        createdAt: "2024-12-09T12:47:11.733Z",
        updatedAt: "2024-12-09T12:47:11.733Z"
    },
    {
        frontCamera: {
            url: "https://res.cloudinary.com/dsfssjubh/image/upload/v1732885548/p7uk5ioet3dx3g7aicod.webp",
            id: "front-camera-4"
        },
        backCamera: {
            url: "https://res.cloudinary.com/dsfssjubh/image/upload/v1732885544/hqfwigib4ypao38fpspe.webp",
            id: "back-camera-4"
        },
        _id: "6756e6cfd5f5a9f701116296",
        location: {
            type: "Point",
            coordinates: [
                71.7626,
                -16.1597
            ],
        },
        user: {
            _id: "6756e6cfd5f5a9f701116272",
            name: "Jerem Blubear",
        },
        createdAt: "2024-12-09T12:47:11.734Z",
        updatedAt: "2024-12-09T12:47:11.734Z"
    },
    {
        frontCamera: {
            url: "https://res.cloudinary.com/dsfssjubh/image/upload/v1732885548/p7uk5ioet3dx3g7aicod.webp",
            id: "front-camera-5"
        },
        backCamera: {
            url: "https://res.cloudinary.com/dsfssjubh/image/upload/v1732885539/q1rgsxlmtuye1bf8pqlf.webp",
            id: "back-camera-5"
        },
        _id: "6756e6cfd5f5a9f701116299",
        location: {
            type: "Point",
            coordinates: [
                68.5499,
                76.2041
            ],
        },
        user: {
            _id: "6756e6cfd5f5a9f701116277",
            name: "Malika Suleiman",
        },
        createdAt: "2024-12-09T12:47:11.735Z",
        updatedAt: "2024-12-09T12:47:11.735Z"
    }
];

</script>

<template>
  <main class="max-h-screen overflow-y-scroll">
    BeReal - Home
    <AppPublicationCard v-for="publication in publications" :key="publication._id" :publication="publication" />
    <!-- 720x1080 -->
  </main>
</template>
<style>
* {
  color: white;
}
</style>

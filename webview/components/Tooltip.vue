<template>
    <div class="tooltip">
        <span class="tooltiptext absolute left-1/2 top-0 z-10 -translate-x-1/2 transform bg-gray-800/90">{{
            text
        }}</span>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
const { text } = defineProps(['text']);
</script>
<style>
/* Tooltip container */
.tooltip {
    position: relative;
}

/* Tooltip text */
.tooltip .tooltiptext {
    visibility: hidden;
    width: max-content;
    font-size: 0.8rem;
    color: #fff;
    text-align: center;
    padding: 2px 8px;
    border-radius: 6px;

    /* Position the tooltip text - see examples below! */
    position: absolute;
    z-index: 999;
}

/* Show the tooltip text when you mouse over the tooltip container */
.item:hover .tooltiptext {
    visibility: visible;
}
</style>

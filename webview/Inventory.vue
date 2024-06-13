<template>
    <div
        class="inventory-container flex h-screen w-screen flex-row items-center justify-center gap-10 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/90"
    >
        <div class="mx-auto w-fit">
            <div class="grid grid-cols-5 gap-3">
                <draggable
                    v-for="(slot, index) in inventory"
                    :key="index"
                    :list="slot.items"
                    class="slot group flex h-[120px] w-[120px] items-center justify-center rounded-lg border border-white/20 bg-gradient-to-tl from-slate-300/30 to-slate-600/30 text-2xl font-medium transition-all duration-300 ease-in-out hover:border-[var(--inv-color)]"
                    :group="{ name: 'item' }"
                    :force-fallback="true"
                    itemKey="name"
                    :data-id="index"
                    @end="onEnd"
                    :move="checkMove"
                >
                    <template #item="{ element }">
                        <div
                            class="item relative h-full w-full rounded-lg border-2 border-transparent p-2 group-hover:border-[var(--inv-color)]"
                            :data-uid="element.uid"
                            v-on:click.right="useItem(element)"
                        >
                            <Tooltip v-if="element.desc" :text="element.desc" />
                            <div
                                class="item-name absolute bottom-0 left-1/2 z-10 -translate-x-1/2 transform text-sm text-white"
                            >
                                {{ element.name }}
                            </div>
                            <div class="item-quant absolute right-2 top-2 z-10 text-sm text-white">
                                x{{ element.quantity }}
                            </div>
                            <div
                                class="item-icon absolute inset-1/2 flex h-full w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center text-sm"
                            >
                                <img class="w-[80%]" :src="`./images/${element.icon}.png`" />
                            </div>
                        </div>
                    </template>
                    <div v-if="slot.items.length === 0" class="empty-slot"></div>
                </draggable>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import draggable from 'vuedraggable';
import { useLocalStorage } from '@Composables/useLocalStorage';
import { useEvents } from '@Composables/useEvents';
import { InventoryConfig } from '../shared/config';
import { InventoryEvents } from '../shared/itemEvents';
import { debugItems } from '../shared/debugItems';
import { Item } from '@Plugins/simple-item-manager/shared/types';

import Tooltip from './components/Tooltip.vue';

const events = useEvents();
const localStorage = useLocalStorage();
const inventorySize = 30;
const inventoryItems = ref<Item[]>([]);
const inventory = ref(Array.from({ length: inventorySize }, () => ({ items: [] as Item[] })));
const currentMoveAllowed = ref(false);

const getSlotIndex = (element: HTMLElement) => parseInt(element.dataset.id);

const onEnd = async (event) => {
    if (!currentMoveAllowed.value) return;

    const fromSlot = getSlotIndex(event.from);
    const toSlot = getSlotIndex(event.to);
    const itemUid = event.item.dataset.uid;

    await setLocalSlot(itemUid, toSlot);

    if (InventoryConfig.debug) {
        console.log(`Moved item ${itemUid} from ${fromSlot} to ${toSlot}`);
    }
};

const addItem = (index: number, itemData: Item) => {
    inventory.value[index].items.push(itemData);
};

const useItem = (item: Item) => {
    if (InventoryConfig.debug) {
        console.log('Item used:', item.name);
    }

    events.emitServer(InventoryEvents.ToServer.USE_ITEM, item);
};

const findEmptySlot = () => inventory.value.findIndex((slot) => slot.items.length === 0);

const checkMove = (evt) => {
    const fromSlot = getSlotIndex(evt.from);
    const toSlot = getSlotIndex(evt.to);
    currentMoveAllowed.value = fromSlot === toSlot || inventory.value[toSlot].items.length === 0;
    return currentMoveAllowed.value;
};

const refreshInventory = async (items: Item[]) => {
    let localItems = (await localStorage.get('inventory')) || {};
    localItems = Object.fromEntries(
        Object.entries(localItems).filter(([key]) => items.some((item) => item.uid === key)),
    );

    localStorage.set('inventory', localItems);
    inventory.value.forEach((entry) => (entry.items = []));
    await initializeInventory(items);
};

const getLocalSlot = async (uid: string) => {
    const localItems = (await localStorage.get('inventory')) || {};

    if (InventoryConfig.debug) {
        console.log(localItems[uid] >= 0 ? `Found item ${uid} in slot ${localItems[uid]}` : `Item ${uid} not found`);
    }

    return localItems[uid] ?? (await setLocalSlot(uid, findEmptySlot()));
};

const setLocalSlot = async (uid: string, slot: number) => {
    const localItems = (await localStorage.get('inventory')) || {};
    localItems[uid] = slot;
    localStorage.set('inventory', localItems);
    return slot;
};

const closeInventory = async () => {
    events.emitServer(InventoryEvents.ToServer.CLOSE);
};

const initializeInventory = async (items: Item[]) => {
    if (InventoryConfig.debug) {
        console.log('Current Items: ', JSON.stringify(items));
        const localItems = (await localStorage.get('inventory')) || {};
        console.log('LocalStorage: ', JSON.stringify(localItems));
    }

    for (const item of items) {
        const slot = await getLocalSlot(item.uid);

        if (slot !== null) {
            inventoryItems.value.push(item);
            addItem(slot, item);
        }
    }
};

onMounted(() => {
    document.documentElement.style.setProperty('--inv-color', '#553adf');

    if (!('alt' in window)) {
        console.error('Alt-V is not defined');
        for (const item of debugItems) {
            if (item.data.slot === null) {
                item.data.slot = findEmptySlot();
            }
            inventoryItems.value.push(item);
            addItem(item.data.slot, item);
        }
    }

    events.on(InventoryEvents.WebView.SET_ITEMS, initializeInventory);
    events.on(InventoryEvents.WebView.REFRESH_ITEMS, refreshInventory);
    events.onKeyUp('ASC:INVENTORY:I', 73, closeInventory);
});

onUnmounted(() => {
    events.offKeyUp('ASC:INVENTORY:I');
});
</script>

<style>
.inventory-container {
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
}

.item:hover {
    transition: all 0.3s ease-in-out;
    background: radial-gradient(circle, rgba(255, 255, 255, 0) 90%, rgba(86, 58, 223, 0.432));
    filter: drop-shadow(0px 0px 10px var(--inv-color));
    -webkit-filter: drop-shadow(0px 0px 10px var(--inv-color));
}

.slot {
    width: calc(5vh * 2.5);
    height: calc(5vh * 2.5);
}
</style>

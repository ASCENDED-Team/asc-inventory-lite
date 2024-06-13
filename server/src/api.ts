import * as alt from 'alt-server';

import { useApi } from '@Server/api/index.js';
import { ItemIDs } from 'plugins/simple-item-manager/shared/ignoreItemIds.js';
import { inventoryAddItem, inventoryRemoveItem } from './inventoryFunctions.js';
import { Item } from '@Plugins/simple-item-manager/shared/types.js';

async function useAscendedInventory() {
    async function addItem(player: alt.Player, name: ItemIDs, quantity: number) {
        await inventoryAddItem(player, name, quantity);
    }

    async function removeItem(player: alt.Player, item: Item) {
        await inventoryRemoveItem(player, item);
    }

    return {
        inventoryAddItem,
        inventoryRemoveItem
    }
}

declare global {
    export interface ServerPlugin {
        ['ascended-inventory-api']: ReturnType<typeof useAscendedInventory>;
    }
}

useApi().register('ascended-inventory-api', useAscendedInventory());
import * as alt from 'alt-server';

import { useApi } from '@Server/api/index.js';
import { ItemIDs } from 'plugins/simple-item-manager/shared/ignoreItemIds.js';
import {
    inventoryAddItem,
    inventoryRemoveItem,
    refreshInventory,
    inventoryAddCustomItem,
} from './inventoryFunctions.js';
import { Item } from '@Plugins/simple-item-manager/shared/types.js';

async function useAscendedInventory() {
    async function addItem(player: alt.Player, name: ItemIDs, quantity: number) {
        await inventoryAddItem(player, name, quantity);
    }

    async function addCustomItem(player: alt.Player, name: ItemIDs, quantity: number, data: object) {
        await inventoryAddCustomItem(player, name, quantity, data);
    }

    async function removeItem(player: alt.Player, item: Item, quantity: number) {
        await inventoryRemoveItem(player, item, quantity);
    }

    async function refreshInventoryItems(player: alt.Player) {
        await refreshInventory(player);
    }
    return {
        addItem,
        addCustomItem,
        removeItem,
        refreshInventoryItems,
    };
}

declare global {
    export interface ServerPlugin {
        ['ascended-inventory-api']: ReturnType<typeof useAscendedInventory>;
    }
}

useApi().register('ascended-inventory-api', useAscendedInventory());

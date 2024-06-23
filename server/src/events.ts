import * as alt from 'alt-server';

import { useRebar } from '@Server/index.js';
import { InventoryEvents } from '../../shared/itemEvents.js';
import { useWebview } from '@Server/player/webview.js';
import { Item } from '@Plugins/simple-item-manager/shared/types.js';
import { inventoryRemoveItem } from './inventoryFunctions.js';

const Rebar = useRebar();
const api = await Rebar.useApi().getAsync('item-manager-api');
const itemUsageManager = api.useItemUsageManager();

alt.onClient(InventoryEvents.ToServer.USE_ITEM, async (player: alt.Player, item: Item) => {
    if (item.useEventName !== '' && item.data.remove === true) {
        await inventoryRemoveItem(player, item, 1);
        itemUsageManager.invoke(player, item);
        return;
    }

    if (item.data.remove === false) {
        itemUsageManager.invoke(player, item);
        return;
    }
});

itemUsageManager.on(InventoryEvents.ToServer.USE_FOOD, (player: alt.Player, uid: string) => {
    console.log(`Event USE_FOOD Fired | Current UID: ${uid}`);
});

itemUsageManager.on(InventoryEvents.ToServer.NO_REMOVE, (player: alt.Player, uid: string) => {
    console.log(`Event NO_REMOVE Fired | Current UID: ${uid}`);
});

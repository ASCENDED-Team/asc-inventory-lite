import * as alt from 'alt-server';
import { useWebview } from '@Server/player/webview.js';
import { InventoryEvents } from '../../shared/itemEvents.js';
import { useRebar } from '@Server/index.js';
import { ItemIDs } from 'plugins/simple-item-manager/shared/ignoreItemIds.js';
import { Item } from '@Plugins/simple-item-manager/shared/types.js';

const Rebar = useRebar();
const NotificationAPI = await Rebar.useApi().getAsync('ascended-notification-api');
const api = await Rebar.useApi().getAsync('item-manager-api');

export async function inventoryAddItem(player: alt.Player, name: ItemIDs, quantity: number): Promise<void> {
    if (!quantity || quantity < 1) return;

    const itemManager = api.useItemManager();
    const playerItemManager = api.usePlayerItemManager(player);

    const didAdd = await playerItemManager.add(name, quantity);

    if (!didAdd) return;

    const item = itemManager.getBaseItem(name);

    NotificationAPI.create(player, {
        title: 'Success',
        subTitle: 'Item added',
        message: `Successfully added ${item.name} x${quantity} to your inventory.`,
        icon: '',
    });
}

export async function inventoryAddCustomItem(
    player: alt.Player,
    name: ItemIDs,
    quantity: number,
    data: object,
): Promise<void> {
    if (!quantity || quantity < 1) return;

    const itemManager = api.useItemManager();
    const playerItemManager = api.usePlayerItemManager(player);

    const didAdd = await playerItemManager.add(name, quantity, data);

    if (!didAdd) {
        alt.log(`did not add item`);
        return;
    }

    const item = itemManager.getBaseItem(name);
}

export async function inventoryRemoveItem(player: alt.Player, item: Item, quantity: number) {
    const itemManager = api.useItemManager();
    const playerItemManager = api.usePlayerItemManager(player);

    const didRemove = await playerItemManager.removeQuantityFrom(item.uid, quantity);

    if (!didRemove) return;

    const currentItem = itemManager.getBaseItem(api.convertToId(item.id));

    NotificationAPI.create(player, {
        title: 'Success',
        subTitle: 'Item removed',
        message: `Successfully removed ${currentItem.name} x1 from your inventory.`,
        icon: '',
    });

    refreshInventory(player);
}

export async function refreshInventory(player: alt.Player) {
    const PlayerItemManager = api.usePlayerItemManager(player);
    const playerItems = PlayerItemManager.get();

    useWebview(player).emit(InventoryEvents.WebView.REFRESH_ITEMS, playerItems);
}

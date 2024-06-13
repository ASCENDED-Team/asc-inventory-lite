import * as alt from 'alt-server';

import { useRebar } from '@Server/index.js';
import { useApi } from '@Server/api/index.js';
import { useWebview } from '@Server/player/webview.js';
import { useKeybinder } from '@Server/systems/serverKeybinds.js';
import { InventoryEvents } from '../../shared/itemEvents.js';

const Rebar = useRebar();
const InventoryAPI = await useApi().getAsync('item-manager-api');

const sessionKey = 'inventory-state';

useKeybinder().on(73, (player) => {
    const currentState = player.getMeta(sessionKey) ?? false;
    const rebarPlayer = Rebar.usePlayer(player);

    if (!currentState) {
        const items = InventoryAPI.usePlayerItemManager(player).get();

        useWebview(player).show('Inventory', 'page');
        useWebview(player).focus();
        rebarPlayer.world.disableControls();

        useWebview(player).emit(InventoryEvents.WebView.SET_ITEMS, items);

        player.setMeta(sessionKey, true);
        return;
    }

    useWebview(player).hide('Inventory');
    useWebview(player).unfocus();
    rebarPlayer.world.enableControls();
    player.setMeta(sessionKey, false);
});

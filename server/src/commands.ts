import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import { ItemIDs } from 'plugins/simple-item-manager/shared/ignoreItemIds.js';
import { useApi } from '@Server/api/index.js';
import { inventoryAddItem } from './inventoryFunctions.js';


const Rebar = useRebar();
const messenger = Rebar.messenger.useMessenger();
const NotificationAPI = await Rebar.useApi().getAsync('ascended-notification-api');
const ItemManager = await useApi().getAsync('item-manager-api');

/* DEBUG */
messenger.commands.register({
    name: 'additem',
    desc: 'Adds an specified item with quantity to yourself',
    callback: async (player: alt.Player, name: ItemIDs, quantity: number) => {
        inventoryAddItem(player, name, quantity);
    }
});

messenger.commands.register({
    name: 'inventory',
    desc: 'Shows your current inventory items',
    callback: async (player: alt.Player) => {
        const PlayerItemManager = ItemManager.usePlayerItemManager(player);
        const playerItems = PlayerItemManager.get();

        NotificationAPI.create(player, {
            title: 'Success',
            subTitle: 'Your Inventory',
            message: `You currently have: ${JSON.stringify(playerItems, undefined, 1)}`,
            icon: '', 
        });
    }
})

messenger.commands.register({
    name: 'clearinventory',
    desc: 'Clears your inventory',
    callback: async (player: alt.Player) => {
        const playerItemManager = ItemManager.usePlayerItemManager(player);
        const document = Rebar.document.character.useCharacter(player).get();
        
        for(const item of document.items) {
            await playerItemManager.clearArray()
        }
    }
});
/* DEBUG END */
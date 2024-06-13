export const InventoryEvents = {
    ToClient: {
        SET_ITEMS: 'asc-inventory:set-items',
        MOVE_ITEM: 'asc-inventory:move-item',
    },
    ToServer: {
        NO_REMOVE: 'asc-inventory:use-no-remove',
        USE_FOOD: 'asc-inventory:use-food',
        USE_DRINK: 'asc-inventory:use-drink',
        USE_ITEM: 'asc-inventory:use-item',
        CLOSE: 'asc-inventory:close-view',
    },
    WebView: {
        SET_ITEMS: 'asc-inventory:set-items',
        REFRESH_ITEMS: 'asc-inventory:refresh-items'
    },
};

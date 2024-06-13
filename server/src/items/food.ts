import { Item } from "plugins/simple-item-manager/shared/types.js";
import { InventoryEvents } from "../../../shared/itemEvents.js";
export const food_items: Array<Item> = [
    {
        uid: 'asc-hotdog',
        id: 'food-hotdog',
        name: 'Hotdog',
        desc: 'Some Hotdog...',
        icon: 'crate',
        maxStack: 12,
        quantity: 1,
        weight: 0,
        useEventName: InventoryEvents.ToServer.USE_FOOD,
        data: {
            remove: true // Should item be removed? Else just fires event. (ID-Card for EXAMPLE)
        },
        rules: {

        }
    }
]
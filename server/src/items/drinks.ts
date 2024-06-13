import { InventoryEvents } from "../../../shared/itemEvents.js";
import { Item } from "plugins/simple-item-manager/shared/types.js";

export const drink_items: Array<Item> = [
    {
        uid: 'asc-bull',
        id: 'food-bull',
        name: 'Redbull',
        desc: 'Icecold Red Bull',
        icon: 'crate',
        maxStack: 12,
        quantity: 1,
        weight: 0,
        useEventName: InventoryEvents.ToServer.NO_REMOVE,
        data: {
            remove: false // Should item be removed? Else just fires event. (ID-Card for EXAMPLE)
        },
        rules: {

        }
    }
]
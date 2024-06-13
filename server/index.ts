import { useApi } from '@Server/api/index.js';
import { drink_items } from './src/items/drinks.js';
import { food_items } from './src/items/food.js';

import './src/api.js';
import './src/commands.js';
import './src/events.js';
import './src/inventoryFunctions.js';
import './src/keybind.js';

const ItemManager = await useApi().getAsync('item-manager-api');
const allItems = [...food_items, ...drink_items];

for(const item of allItems) {
    await ItemManager.useItemManager().create(item);
}
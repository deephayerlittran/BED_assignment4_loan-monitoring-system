/**
 * Item Service (itemService.ts)
 *
 * This file defines functions (services) for managing item data. These functions
 * currently store items in-memory but could be extended to use a database.
 */
import { Item } from "../models/itemModel";
import {
    getDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
} from "../repositories/firestoreRepository";

const COLLECTION = "items";

/**
 * @description Get all items.
 * @returns {Promise<Item[]>}
 */
export const getAllItems = async (): Promise<Item[]> => {
    const snapshot: FirebaseFirestore.QuerySnapshot = await getDocuments(
        COLLECTION
    );

    return snapshot.docs.map((doc) => {
        const data: FirebaseFirestore.DocumentData = doc.data();
        return { id: doc.id, ...data } as Item;
    });
};

/**
 * @description Create a new item.
 * @param {Partial<Item>} item - The item data.
 * @returns {Promise<Item>}
 */
export const createItem = async (item: Partial<Item>): Promise<Item> => {
    const id: string = await createDocument(COLLECTION, item);
    return { id, ...item } as Item;
};

/**
 * @description Update an existing item.
 * @param {string} id - The ID of the item to update.
 * @param {Partial<Item>} item - The updated item data.
 * @returns {Promise<Item>}
 * @throws {Error} If the item with the given ID is not found.
 */
export const updateItem = async (
    id: string,
    item: Partial<Item>
): Promise<Item> => {
    await updateDocument(COLLECTION, id, item);
    return { id, ...item } as Item;
};

/**
 * @description Delete an item.
 * @param {string} id - The ID of the item to delete.
 * @returns {Promise<void>}
 * @throws {Error} If the item with the given ID is not found.
 */
export const deleteItem = async (id: string): Promise<void> => {
    await deleteDocument(COLLECTION, id);
};

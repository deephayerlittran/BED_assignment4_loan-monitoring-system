/**
 * @interface Item
 * @description Represents an item object.
 */
export type Item = {
    id: string;
    name: string;
    description: string;
    price?: number;
    createdAt: Date;
    updatedAd: Date;
};

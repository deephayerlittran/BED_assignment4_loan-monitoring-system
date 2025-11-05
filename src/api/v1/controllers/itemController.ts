/**
 * Item Controller (itemController.ts)
 *
 * This file defines functions (controllers) for handling incoming requests related to items.
 * These functions interact with the item service (itemService.ts) to perform the actual
 * logic for CRUD operations on items.
 */

import { Request, Response, NextFunction } from "express";
import * as itemService from "../services/itemService";
import type { Item } from "../models/itemModel";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

/**
 * @description Get all items.
 * @route GET /
 * @returns {Promise<void>}
 */
export const getAllItems = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const items: Item[] = await itemService.getAllItems();

        res.status(HTTP_STATUS.OK).json(
            successResponse(items, "Items Retrieved")
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description Create a new item.
 * @route POST /
 * @returns {Promise<void>}
 */
export const createItem = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // call the itemService by passing the body of the request
        const newItem: Item = await itemService.createItem(req.body);

        res.status(HTTP_STATUS.CREATED).json(
            successResponse(newItem, "Item Created")
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description Update an existing item.
 * @route PUT /:id
 * @returns {Promise<void>}
 */
export const updateItem = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // call the itemService by passing the id from thge url path and the body of the request
        const updatedItem: Item = await itemService.updateItem(
            req.params.id,
            req.body
        );

        res.status(HTTP_STATUS.OK).json(
            successResponse(updatedItem, "Item Updated")
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description Delete an item.
 * @route DELETE /:id
 * @returns {Promise<void>}
 */
export const deleteItem = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        await itemService.deleteItem(req.params.id);

        // I set this to 200 but it could also be a 204 code https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
        res.status(HTTP_STATUS.OK).json(successResponse("Item Deleted"));
    } catch (error) {
        next(error);
    }
};

import axios from "axios";
import { Dayjs } from 'dayjs';

import { 
    addGuestEndpoint, 
    deleteGuestEndpoint, 
    getAllGuestEndpoint, 
    getAllWishesEndpoint, 
    getGuestByIdEndpoint, 
    updateGuestEndpoint 
} from "./app-config";

export type MetadataType = {
    nextPage: string;
    prevPage: string;
};

export type searchQuery = {
    name?: string
    phone?: number
    email?: string
    pageToken?: string
    nextPage?: string
    prevPage?: string
};

export interface GuestType {
    id: string
    Id?: string
    name: string
    phone: number
    email: string
    note: string
    wishes: string
    createdAt: Dayjs
}

export interface WishesType extends Pick<GuestType, 'id' | 'name' | 'wishes'> {}

export interface updateGuestTypeDto {
    name: string
    phone?: number
    email?: string
    note?: string
}

export interface updateGuestWishesDto {
    wishes: string
}

export const appService = () => {

    const getListKhachMoi = async (query?: searchQuery) => {
        const response = await axios.get<{
            paging: MetadataType;
            data: GuestType[];
        }>(`${getAllGuestEndpoint}`, {
            params: query
        });
        return response;
    }

    const getListLoiChuc = async (query?: searchQuery) => {
        const response = await axios.get<{
            paging: MetadataType;
            data: WishesType[];
        }>(`${getAllWishesEndpoint}`, {
            params: query
        });
        return response;
    }

    const getKhachMoi = async (id: string) => {
        const response = await axios.get<GuestType>(
            `${getGuestByIdEndpoint}?id=${id}`
        );
        return response;
    }

    const postKhachMoi = async (body: updateGuestTypeDto) => {
        const response = await axios.post<GuestType>(
            `${addGuestEndpoint}`, body
        )
        return response;
    }

    const patchKhachMoi = async (id: string, body: updateGuestTypeDto) => {
        const response = await axios.patch<GuestType>(
            `${updateGuestEndpoint}?id=${id}`, body
        )
        return response;
    }

    const patchLoiChucKhachMoi = async (id: string, body: updateGuestTypeDto, wishes: string) => {
        const data = {
            ...body,
            wishes
        }
        const response = await axios.patch<GuestType>(
            `${updateGuestEndpoint}?id=${id}`, data
        )
        return response;
    }

    const deleteKhachMoi = async (id: string) => {
        const response = await axios.delete<GuestType>(
            `${deleteGuestEndpoint}?id=${id}`
        );
        return response;
    }

    return{
        getListKhachMoi,
        getListLoiChuc,
        getKhachMoi,
        postKhachMoi,
        patchKhachMoi,
        deleteKhachMoi,
        patchLoiChucKhachMoi,
    }
}
  
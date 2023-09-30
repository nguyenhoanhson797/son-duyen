import axios from "axios";
import { 
    addGuestEndpoint, 
    deleteGuestEndpoint, 
    getAllGuestEndpoint, 
    getGuestByIdEndpoint, 
    updateGuestEndpoint 
} from "./app-config";

export type MetadataType = {
    page: string;
    nextPage: string;
    prevPage: string;
};

export type searchQuery = {
    name?: string
    phone?: number
    email?: string
    pageToken?: string
    page?: string
};

export interface GuestType {
    Id: string
    name: string
    phone: number
    email: string
    note: string
    wishes: string
}

export interface updateGuestTypeDto {
    name: string
    phone?: number
    email?: string
    note: string
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
        getKhachMoi,
        postKhachMoi,
        patchKhachMoi,
        deleteKhachMoi,
        patchLoiChucKhachMoi,
    }
}
  
import axios from "axios";
import { addGuestEndpoint, deleteGuestEndpoint, getAllGuestEndpoint, getGuestByIdEndpoint, updateGuestEndpoint } from "./app-config";

export type MetadataType = {
    paging: {
      cursor: {
        current: string;
        next: string;
        prev: string;
      };
      limit: number;
    };
};

export type searchQuery = {
    name: string
    phone: number
    email: string
};

export interface GuestType {
    id: string
    name: string
    phone: number
    email: string
}

export interface updateGuestTypeDto {
    name?: string
    phone?: number
    email?: string
}

export const appService = () => {

    const getListKhachMoi = async (query?: searchQuery) => {
        const response = await axios.get<{
            metadata: MetadataType;
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
        deleteKhachMoi
    }
}
  
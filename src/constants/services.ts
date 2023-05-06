import { APP_URL, getAllGuestEndpoint } from "./app-config";
import { axiosClient } from "./custom-fetch"

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
    name: string
    phone: number
    email: string
}

const token = "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDBE51BvUVNS29h\nNrQ791q+YACtzFvFGTKoclKgrT8OTgDyyq5VttLUOarmZCSjUlSLuBb/UrIvpvfK\nqZy6VZUqgZ9Vbq1d6fR5OQfRevn+ljgmskEGIto2IW/FxHSMTbsMOL0NX48BCNVd\n4GnRKpnSCYBvDx4ocL7+BHz/1mRDRhiFMKJlQJC1uc7urfiydDndXhGO8HwfvRPZ\nkHVK23CD8thMROutaXDgwATg90v2mFrmTU7EpmMemO/jdxwHqIwWzNYtTzD4DYgS\nkNcL9x+3R6k6eIZGmJmCfKvCRttWx2Q8tQqyj+Zjbsa93IEa0KiJN6/KlJPZnJSl\n/ZcmREWnAgMBAAECggEAR5DhpVBms7PWYQ5J2EBjXlVvavxot7ITWOSnQ+9zg/Xd\n3CDMZfESTJ/jfOp5uh/2PqPJwnIAojEdf/1GnrrCQ7MwQBZ6JGlnuNcu0rLmnztH\nLPC9sWyRvaa/K2saWDcnsewGB0L4WsXPcLCSCHnl8jibZo8P+qVv5e/79UieeWCI\nOlfuQrE02TzWnitsUm0t5kjFEokp53Hl3WXJmOU2VufWjWwNhliTThXp4Vl/hzz7\nClSw2MbWONl8kM7KeMMvtmplKRbR9homhgNU6kckIFOpMb9VnwIvNun/u8ZYUa1M\n7Jp2u1iRGfHBt6pncQVTQncdpTrDcyBFkRIIfXyegQKBgQD4XT8DlXi6cNizqzM2\n3gfooJ3mVMrHxoR+0mZxbr+C7HWywqCF9r6RiLuCH8srxImHJUuQKAt3zrLEIT4a\n2EK9uBUXNmQ0uxpsasrlj5COxS2f0m4KoZSoR1v4hNjtfrD5rEPbK1TMxtgTafDt\nhmNYDj6Cn3mzw67v7e/Wsg2w8QKBgQDHAznoYnB0/pdWwMf/sSquMSwhqmEYNFaq\niKoL95sdOWu4xIDqOESsmtGMFA2jqlwHZktwJedFL/MY5EorN5mmecIeyRjRBU4y\nHyIaUOW4ByOBXHw4eAoSxhiUJ2c5w0nmmlAEgyY6rQpqjizsnVsERL0QX6qc1JfE\n03U5D59gFwKBgQCqT98fSQeR6kJf6p1jGZyYxFOjGDA6EILZKNTBIm3HjPklDVvg\noZSK3hWfJMhBCjQ47bVEdIFwtdhWsGkTJYuW573mvhC3LDrxb8YU5378uHAR8c4u\nEiGLx+tkn0zWh5M6kwuxJqSvDAguP+7MIuTLBHGPR2bAhAbZVvOp6U2EMQKBgQCD\nYJ3ZyyJyGZ/OpXViVpLWa5+2mcN/Nw3/hji7rbm4kS+Lyi1QcdTkHVA4KQTYBp66\nQ82JO3xxMDZLOGm+HfZQ8BA2QosfcWEttV/N/5mm4w+NVoCqxpPf0OZo55o9h65B\njZ1FXU7fbVxy+2isyzRKnRYyuPTok2+df/risG2GAQKBgEOWzrWqRSCOXJkvri5N\nKByso8W3TaKy8jGprEMEoqvW7RMVs8IE5EQUUi1YJaYFUUZ29H8bvqm2WD/ywsJO\nzMoDG2pp2GYg+NkBKhxlOyM53LCJgRw2iAg6ijKUn7KAGTWbBsGZ0AfqA+xFfSGv\nGIbtx258Ksm7CmmkNgv6Rvfp"

export const ungVienService = () => {
    const axios = axiosClient(token)

    const getListKhachMoi = async (query?: searchQuery) => {
        const response = await axios.get<{
            metadata: MetadataType;
            data: GuestType;
        }>(`${getAllGuestEndpoint}`, {
            params: query
        });
        return response;
    }

    const getKhachMoi = async (khachMoiId: string) => {
        const response = await axios.get<GuestType>(
            `${getAllGuestEndpoint}/${khachMoiId}`
        );
        return response;
    }

    const postKhachMoi = async (body: GuestType) => {
        const response = await axios.post<GuestType>(
            `${getAllGuestEndpoint}`, {body}
        )
        return response;
    }

    const patchKhachMoi = async (khachMoiId: string, body: GuestType) => {
        const response = await axios.patch<GuestType>(
            `${getAllGuestEndpoint}/${khachMoiId}`, body
        )
        return response;
    }

    const deleteKhachMoi = async (khachMoiId: string) => {
        const response = await axios.delete<GuestType>(
            `${getAllGuestEndpoint}/${khachMoiId}`
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
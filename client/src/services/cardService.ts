import axios from "axios";

export const getCardsByColor = async (color: string, page: number) => {
    try {
        const response = await axios.get(
            `http://localhost:5173/api/cards/color/${color}?page=${page}`
        );
        return response.data;
    } catch (error) {
        console.error(`Error fetching cards: ${error}`);
    }
};

export const getCardsByName = async (name: string, page: number) => {
    try {
        const response = await axios.get(
            `http://localhost:5173/api/cards/search/${name}?page=${page}`
        );
        return response.data;
    } catch (error) {
        console.error(`Error fetching cards: ${error}`);
    }
};

export const fetchCards = async (page: number) => {
    try {
        const response = await axios.get(
            `http://localhost:5173/api/cards?page=${page}`
        );
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Error fetching cards");
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

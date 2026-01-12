import API from "../utils/api";

export const createGenre = async (genreData) => {
    const response = await API.post("/genres", genreData);
    return response.data;
};

export const getAllGenres = async () => {
    const response = await API.get("/genres");
    return response.data;
};

export const updateGenre = async (id, genreData) => {
    const response = await API.put(`/genres/${id}`, genreData);
    return response.data;
};

export const deleteGenre = async (id) => {
    const response = await API.delete(`/genres/${id}`);
    return response.data;
};
const BASE_URL = "http://localhost:8080/api/diary"; 

const api = {

    getEntries: async () => {
        try {
            const response = await fetch(BASE_URL);
            if (!response.ok) {
                throw new Error("Error al obtener las entradas");
            }
            return await response.json();
        } catch (error) {
            console.error("Error en getEntries:", error);
            return [];
        }
    },


    addEntry: async (entry) => {
        try {
            const response = await fetch(BASE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(entry),
            });
            if (!response.ok) {
                throw new Error("Error al agregar la entrada");
            }
            return await response.json();
        } catch (error) {
            console.error("Error en addEntry:", error);
            return null;
        }
    },


    deleteEntry: async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Error al eliminar la entrada");
            }
        } catch (error) {
            console.error("Error en deleteEntry:", error);
        }
    },


    updateEntry: async (entry) => {
        try {
            const response = await fetch(BASE_URL, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(entry),
            });
            if (!response.ok) {
                throw new Error("Error al actualizar la entrada");
            }
            return await response.json();
        } catch (error) {
            console.error("Error en updateEntry:", error);
            return null;
        }
    },
};

export default api;

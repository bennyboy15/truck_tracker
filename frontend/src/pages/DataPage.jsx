import { useQuery } from "@tanstack/react-query"
import axiosInstance from "../utils/axios.js";

function DataPage() {

    const { isPending, error, data } = useQuery({
        queryKey: ['truckMakes'],
        queryFn: async () => {
            const response = await axiosInstance.get("/truck_make");
            console.log(response.data);
            return response.data;
        }
    });

    if (isPending) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message

    return (
        <div>
            <h1>👀{data[0].name}</h1>
            <p>✨{data[0].code}</p>
        </div>
    )
}

export default DataPage
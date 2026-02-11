import { Alert } from 'antd';
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axios.js";
import TruckMakeTable from '../components/truck/TruckMakeTable.jsx';

function DataPage() {
    const { isPending, error, data } = useQuery({
        queryKey: ['truckMakes'],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/truck_make");
            return data;
        }
    });

    const columns = [
        {
            title: 'Make Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
        },
    ];

    if (error) return <Alert title="Error" description={error.message} type="error" showIcon />;

    return (
        <TruckMakeTable columns={columns} data={data} isPending={isPending}/>
    );
}

export default DataPage;
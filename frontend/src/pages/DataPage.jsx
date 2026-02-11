import TruckMakeTable from '../components/truck/truckMake/TruckMakeTable.jsx';
import TruckMakeCreate from '../components/truck/truckMake/TruckMakeCreate.jsx';
import TruckModelTable from '../components/truck/truckModel/TruckModelTable.jsx';
import TruckModelCreate from '../components/truck/truckModel/TruckModelCreate.jsx';

function DataPage() {

    return (
        <div className='flex gap-10'>
            {/* TRUCK MAKE */}
            <div className="flex flex-col gap-8">
                <TruckMakeTable />
                <TruckMakeCreate />
            </div>
            {/* TRUCK MODEL */}
            <div className="flex flex-col gap-8">
                <TruckModelTable />
                <TruckModelCreate />
            </div>
        </div>
    );
}

export default DataPage;

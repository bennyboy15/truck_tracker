import React from 'react'
import TruckList from '../components/schedule/TruckList'

function Schedule() {
  return (
    <div className=''>
        <div className='flex gap-4'>
            <div className='py-5 px-5 max-w-4xl bg-gray-100 h-[95vh] rounded-r-2xl border shadow-lg'>
                <TruckList/>
            </div>
            <div className='flex-1'>
                <TruckList/>
            </div>
        </div>
    </div>
  )
}

export default Schedule
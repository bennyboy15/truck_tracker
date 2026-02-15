import React, { useState } from 'react'
import { Button, Input, Select, Badge, Space } from 'antd'
import { CheckCircleOutlined, ClockCircleOutlined, TruckOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons'

const mockTrucks = [
  {
    id: 1,
    customer: 'John Smith',
    make: 'Kenworth',
    model: 'T610SAR',
    chassis: 'KW2023001',
    status: 'active',
    technician: 'Benjamin Harvey',
    dueDate: '2026-02-20'
  },
  {
    id: 2,
    customer: 'ABC Logistics',
    make: 'Peterbilt',
    model: '389',
    chassis: 'PB2023002',
    status: 'upcoming',
    technician: 'Sarah Johnson',
    dueDate: '2026-02-25'
  },
  {
    id: 3,
    customer: 'Express Freight',
    make: 'Volvo',
    model: 'VNL',
    chassis: 'VV2023003',
    status: 'completed',
    technician: 'Mike Davis',
    dueDate: '2026-02-10'
  },
  {
    id: 4,
    customer: 'Midwest Trucking',
    make: 'Freightliner',
    model: 'Cascadia',
    chassis: 'FR2023004',
    status: 'active',
    technician: 'Benjamin Harvey',
    dueDate: '2026-02-22'
  },
]

function TruckList() {
  const [selectedStatus, setSelectedStatus] = useState('all')

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'green'
      case 'upcoming': return 'blue'
      case 'completed': return 'gray'
      default: return 'default'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return <CheckCircleOutlined />
      case 'upcoming': return <ClockCircleOutlined />
      case 'completed': return <CheckCircleOutlined />
      default: return null
    }
  }

  const filteredTrucks = selectedStatus === 'all' 
    ? mockTrucks 
    : mockTrucks.filter(truck => truck.status === selectedStatus)

  return (
    <div className="flex flex-col gap-6 p-6">
        {/* HEADER */}
        <div className='flex flex-col gap-2'>
            <h1 className='text-3xl text-gray-900 font-bold'>Truck List</h1>
            <p className='text-gray-500'>Select a truck for a detailed view</p>
        </div>

        {/* Tab list */}
        <div className='flex gap-3 border-b border-gray-200'>
            {['all', 'active', 'upcoming', 'completed'].map(status => (
              <Button
                key={status}
                type={selectedStatus === status ? 'primary' : 'text'}
                onClick={() => setSelectedStatus(status)}
                className='capitalize font-medium'
              >
                {status}
              </Button>
            ))}
        </div>

        {/* Search fields */}
        <div className='flex gap-3 flex-wrap'>
            <Input 
              placeholder='Search by customer name, chassis or stock...'
              className='flex-1 min-w-[300px]'
              size='middle'
            />
            <Select
                defaultValue=""
                style={{ width: 140 }}
                placeholder="Select month"
                options={[
                    { value: 'jan', label: 'January' },
                    { value: 'feb', label: 'February' },
                    { value: 'mar', label: 'March' },
                    { value: 'apr', label: 'April'},
                ]}
            />
            <Select
                defaultValue=""
                style={{ width: 160 }}
                placeholder="Select technician"
                options={[
                    { value: 'user-id', label: 'Benjamin Harvey' },
                ]}
            />
        </div>

        {/* Truck List Table */}
        <div className='w-full overflow-x-auto'>
            <div className='rounded-lg border border-gray-200 shadow-sm bg-white overflow-hidden'>
              {/* Table Header */}
              <div className='bg-gradient-to-r from-slate-50 to-slate-100 border-b border-gray-200 p-4'>
                <div className='grid grid-cols-6 gap-4 font-semibold text-gray-700 text-sm'>
                  <div>Customer</div>
                  <div>Truck Info</div>
                  <div>Chassis</div>
                  <div>Technician</div>
                  <div>Due Date</div>
                  <div>Status</div>
                </div>
              </div>

              {/* Table Body */}
              <div className='divide-y divide-gray-200'>
                {filteredTrucks.length > 0 ? (
                  filteredTrucks.map((truck) => (
                    <div
                      key={truck.id}
                      className='p-4 hover:bg-blue-50 transition-colors duration-150 cursor-pointer group'
                    >
                      <div className='grid grid-cols-6 gap-4 items-center'>
                        {/* Customer */}
                        <div className='flex items-center gap-2'>
                          <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center'>
                            <UserOutlined className='text-blue-600' />
                          </div>
                          <span className='text-gray-900 font-medium'>{truck.customer}</span>
                        </div>

                        {/* Make/Model */}
                        <div className='flex items-center gap-2'>
                          <TruckOutlined className='text-gray-500 text-lg' />
                          <div className='flex flex-col'>
                            <span className='text-xs text-gray-500 font-medium'>Make/Model</span>
                            <span className='text-gray-900 font-medium'>{truck.make} {truck.model}</span>
                          </div>
                        </div>

                        {/* Chassis */}
                        <div>
                          <span className='text-xs text-gray-500 font-medium block mb-1'>Chassis</span>
                          <span className='bg-gray-100 px-2 py-1 rounded text-sx font-mono text-gray-800'>{truck.chassis}</span>
                        </div>

                        {/* Technician */}
                        <div>
                          <span className='text-xs text-gray-500 font-medium block mb-1'>Technician</span>
                          <span className='text-gray-900'>{truck.technician}</span>
                        </div>

                        {/* Due Date */}
                        <div className='flex items-center gap-2'>
                          <CalendarOutlined className='text-gray-400' />
                          <span className='text-gray-700'>{truck.dueDate}</span>
                        </div>

                        {/* Status */}
                        <div>
                          <Badge 
                            icon={getStatusIcon(truck.status)}
                            color={getStatusColor(truck.status)} 
                            text={<span className='capitalize font-medium text-gray-700'>{truck.status}</span>}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='p-12 text-center'>
                    <p className='text-gray-500 text-lg'>No trucks found</p>
                  </div>
                )}
              </div>
            </div>
        </div>
    </div>
  )
}

export default TruckList
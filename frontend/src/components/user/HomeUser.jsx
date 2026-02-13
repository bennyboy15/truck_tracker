import React from 'react'
import { Card } from 'antd'
import {useAuthStore} from "../../store/authStore.js";

function HomeUser() {
    const {user} = useAuthStore();
  return (
    <Card>
        <div className='flex flex-col gap-4'>
            <h3>Good Morning!</h3>
            <h1>{user.name}</h1>
        </div>
    </Card>
  )
}

export default HomeUser
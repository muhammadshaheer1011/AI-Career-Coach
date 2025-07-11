import { getIndustryInsights } from '@/actions/dashboard';
import { getUserOnBoardingStatus } from '@/actions/user';
import { redirect } from 'next/navigation';
import React from 'react'
import DashboardView from './_components/dashboard-view';

const IndustryInsightsPage =async () => {
        const insights=await getIndustryInsights()
        const {isOnBoarded}=await getUserOnBoardingStatus();
        if(!isOnBoarded){
            redirect('/onboarding')
        }
  return (
    <div className='container mx-auto'>
        <DashboardView insights={insights}/>
    </div>
  )
}

export default IndustryInsightsPage
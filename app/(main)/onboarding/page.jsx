import { industries } from '@/data/industries'
import React from 'react'
import OnBoardingForm from './_components/OnBoardingForm'
import { getUserOnBoardingStatus } from '@/actions/user'
import { redirect } from 'next/navigation'


export default async function OnboardingPage() {
    const {isOnBoarded}=await getUserOnBoardingStatus();
    if(isOnBoarded){
        redirect('/dashboard')
    }
  return (
    <main>
        <OnBoardingForm industries={industries}/>
    </main>
  )
}


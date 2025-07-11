import { getAssessment } from '@/actions/interview'
import React from 'react'
import StatsCards from './_components/stats-cards'
import PerformanceCharts from './_components/performance-charts'
import QuizList from './_components/quiz-list'

const InterviewPage = async() => {
  const assessments=await getAssessment()
  return (
    <div>
      <h1 className='text-6xl font-bold gradient-title mb-5'>
        Interview Preparation
      </h1>
      <div>
        <StatsCards assessments={assessments}/>
        <PerformanceCharts assessments={assessments}/>
        <QuizList assessments={assessments}/>
      </div>

    </div>
  )
}

export default InterviewPage
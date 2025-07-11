'use server'

import { db } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI=new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model=genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
})

export async function generateQuiz (){
    const {userId}=await auth()
        if(!userId) throw new Error("Unauthorized")
            const user=await db.user.findUnique({
                where:{
                    clerkUserId:userId,
                },
            })
    
        if(!user) throw new Error("User not found")
    try{

    const prompt = `
    Generate 10 technical interview questions for a ${
      user.industry
    } professional${
    user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
  }.
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;

        const result=await model.generateContent(prompt)
        const response=result.response
        const text=response.text()

        const cleanedText=text.replace(/```(?:json)?\n?/g,"").trim()
        const quiz= JSON.parse(cleanedText)
        return quiz.questions
        }catch(error){
    console.log("Error generating quiz",error)
    throw new Error('Failed to generate quiz questions')
}
} 

export async function saveQuizResult(questions,answers,score){
    const {userId}=await auth()
        if(!userId) throw new Error("Unauthorized")
            const user=await db.user.findUnique({
                where:{
                    clerkUserId:userId,
                },
            })
    
        if(!user) throw new Error("User not found")
            const questionResults=questions.map((question,index)=>({
                question:question.question,
                answer:question.correctAnswer,
                userAnswer:answers[index],
                isCorrect:question.correctAnswer===answers[index],
                explanation: question.explanation,
            })
        )
        let improvementTip=null
        const wrongAnswers=questionResults.filter((question)=>!question.isCorrect)
        if(wrongAnswers.length>0){
            const wrongQuestionsText=wrongAnswers.
            map(
                (question)=>`Question: "${question.question}"\nCorrect Answer: "${question.answer}"\nUser Answer: "${question.userAnswer}"`)
                .join('\n\n')
        
        const improvementPrompt = `
      The user got the following ${user.industry} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;
try{
       const result=await model.generateContent(improvementPrompt)
        const response=result.response
        improvementTip=response.text().trim()

}catch(error){
        console.log("Error generating improvement tip",error)

}

}
try{
    const assessment=await db.assessment.create({
        data:{
            userId:user.id,
            quizScore:score,
            questions:questionResults,
            category:'Technical',
            improvementTip,

        }
    })
    return assessment

}catch(error){
        console.log("Error saving quiz result",error)
    throw new Error('Failed to save quiz result')

}
}

export async function getAssessment (){
    const {userId}=await auth()
        if(!userId) throw new Error("Unauthorized")
            const user=await db.user.findUnique({
                where:{
                    clerkUserId:userId,
                },
            })
    
        if(!user) throw new Error("User not found")
        
            try{
                const assessments=await db.assessment.findMany({
                    where:{
                        userId:user.id,
                    },
                    orderBy:{
                        createdAt: "asc",
                    },
                })
                return assessments
    }catch(error){
        console.log("Error fetching assessments:", error)
        throw new Error("Failed to fetch assessments")

    }
        }
'use client'
import { saveResume } from '@/actions/resume'
import { resumeSchema } from '@/app/lib/schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import useFetch from '@/hooks/use-fetch'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, Download, Edit, Loader2, Monitor, Save } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import EntryForm from './entry-form'
import { entriesToMarkdown } from '@/app/lib/helper'
import MarkdownEditor from '@uiw/react-markdown-editor'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'




const ResumeBuilder = ({initialContent}) => {
    const{user}=useUser()
    const [isgenerating, setisgenerating] = useState(false)
    const [activeTab, setactiveTab] = useState('edit')
    const [resumeMode, setresumeMode] = useState('preview')
    const [previewContent, setpreviewContent] = useState(initialContent)

   const {control,register,handleSubmit,watch,formState:{errors},}= useForm({
        resolver:zodResolver(resumeSchema),
        defaultValues:{
            contactInfo:{},
            summary:"",
            skills:'',
            experience:[],
            education:[],
            projects:[],
        },
    })
    const {
        loading:isSaving,
        fn:saveResumeFn,
        data:saveResult,
        error:saveError,
    }=useFetch(saveResume)

    const formValues=watch()
    useEffect(() => {
      if(initialContent) setactiveTab('preview')
    
      
    }, [initialContent])
    useEffect(() => {
      if(activeTab==='edit'){
        const newContent=getCombinedContent()
        setpreviewContent(newContent?newContent:initialContent)
      }
    
      
    }, [formValues,activeTab])

    useEffect(() => {
        if(saveResult&& !isSaving){
            toast.success('Resume saved successfully')
        }
        if(saveError){
            toast.error(saveError.message|| 'Failed to save resume')
        }
      
    }, [saveResult,saveError,isSaving])
    
    
    const onSubmit=async()=>{
        try{
            await saveResumeFn(previewContent)
        }catch(error){
            console.log('Save error', error)
        }

    }
 const downloadMarkdown = () => {
  const element = document.createElement("a");
  const file = new Blob([previewContent], { type: "text/markdown" });
  element.href = URL.createObjectURL(file);
  element.download = "resume.md";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

    const getContactMarkdown=()=>{
        const {contactInfo}=formValues
        const parts=[]
        if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
        if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
        if (contactInfo.linkedin)
        parts.push(`💼 [LinkedIn](${contactInfo.linkedin})`);
        if (contactInfo.github) parts.push(`💻  [Github](${contactInfo.github})`);

        return parts.length > 0
            ? `## <div align="center">${user.fullName}</div>
                \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
            : "";


    }
    const getCombinedContent=()=>{
        const {summary,skills,experience,education,projects}=formValues
        return[
            getContactMarkdown(),
            summary && `## Professional Summary\n\n${summary}`,
            skills && `## Skills\n\n${skills}`,
            entriesToMarkdown(experience,'Work Experience'),
            entriesToMarkdown(education,'Education'),
            entriesToMarkdown(projects,'Projects')
        ].filter(Boolean).join('\n\n')


    }
  return (
    <div className='space-y-4'>
        <div className='flex flex-col md:flex-row justify-between items-center gap-2'>
            <h1 className='font-bold gradient-title text-5xl md:text-6xl'>
                Resume Builder
            </h1>
            <div className='space-x-2'>
                <Button variant={'destructive'} onClick={onSubmit}>
                    {isSaving ? (
                        <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                        Saving...
                        </>

                    ):(
                        <>
                        <Save className='h-4 w-4'/>
                            Save 
                        </>
                    )}
                </Button>
                <Button onClick={downloadMarkdown} disabled={isgenerating}>
                    {isgenerating ?(
                        <>
                        <Loader2 className='h-4 w-4 animate-spin'/>
                        Generating Markdown...
                        </>
                    ):(
                        <>
                        <Download className='h-4 w-4'/>
                        Download Markdown 
                        </>
                    )}
                </Button>
            </div>
        </div>
        <Tabs value={activeTab} onValueChange={setactiveTab}>
            <TabsList>
                <TabsTrigger value="edit">Form</TabsTrigger>
                <TabsTrigger value="preview">Markdown</TabsTrigger>
            </TabsList>
            <TabsContent value="edit">
                <form className='space-y-8'>
                    <div className='space-y-4'>
                        <h3 className='text-lg font-medium'>
                            Contact Information
                        </h3>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50'>
                        <div className='space-y-2'>
                            <label className='text-sm font-medium'>Email</label>
                            <Input
                            {...register('contactInfo.email')}
                            type={'email'}
                            placeholder='your@email.com'
                            error={errors.contactInfo?.email}
                            />
                            {errors.contactInfo?.email && (
                                <p className='text-sm text-red-500'>
                                    {errors.contactInfo.email.message}
                                </p>
                            )}
                        </div>
                        
                         <div className='space-y-2'>
                            <label className='text-sm font-medium'>Mobile Number</label>
                            <Input
                            {...register('contactInfo.mobile')}
                            type={'tel'}
                            placeholder='+1 234 567 8900'
                            error={errors.contactInfo?.mobile}
                            />
                            {errors.contactInfo?.mobile && (
                                <p className='text-sm text-red-500'>
                                    {errors.contactInfo.mobile.message}
                                </p>
                            )}
                        </div>

                         <div className='space-y-2'>
                            <label className='text-sm font-medium'>LinkedIn URL</label>
                            <Input
                            {...register('contactInfo.linkedin')}
                            type={'url'}
                            placeholder='https://linkedin.com/in/your-profile'
                            error={errors.contactInfo?.linkedin}
                            />
                            {errors.contactInfo?.linkedin && (
                                <p className='text-sm text-red-500'>
                                    {errors.contactInfo.linkedin.message}
                                </p>
                            )}
                        </div>

                         <div className='space-y-2'>
                            <label className='text-sm font-medium'>Github</label>
                            <Input
                            {...register('contactInfo.github')}
                            type={'url'}
                            placeholder='https://github.com/your-username'
                            error={errors.contactInfo?.github}
                            />
                            {errors.contactInfo?.github && (
                                <p className='text-sm text-red-500'>
                                    {errors.contactInfo.github.message}
                                </p>
                            )}
                        </div>

                        </div>
                    </div>

                    <div className='space-y-4'>
                        <h3 className='text-lg font-medium'>
                            Professional Summary
                        </h3>
                        <Controller
                        name='summary'
                        control={control}
                        render={({field})=>(
                            <Textarea
                            {...field}
                            className={'h-32'}
                            placeholder='Write a compelling professional summary...'
                            error={errors.summary}
                            />
                        )}
                        />
                        {errors.summary && (
                            <p className='text-sm text-red-500'>
                                {errors.summary.message}
                            </p>
                        )}
                    </div>

                    <div className='space-y-4'>
                        <h3 className='text-lg font-medium'>
                            Skills
                        </h3>
                        <Controller
                        name='skills'
                        control={control}
                        render={({field})=>(
                            <Textarea
                            {...field}
                            className={'h-32'}
                            placeholder='List your key skills...'
                            error={errors.skills}
                            />
                        )}
                        />
                        {errors.skills && (
                            <p className='text-sm text-red-500'>
                                {errors.skills.message}
                            </p>
                        )}
                    </div>

                    <div className='space-y-4'>
                        <h3 className='text-lg font-medium'>
                            Work Experience
                        </h3>
                        <Controller
                        name='experience'
                        control={control}
                        render={({field})=>(
                            <EntryForm
                            type={'Experience'}
                            entries={field.value}
                            onChange={field.onChange}
                            />
                            
                        )}
                        />
                        {errors.experience && (
                            <p className='text-sm text-red-500'>
                                {errors.experience.message}
                            </p>
                        )}
                    </div>

                    <div className='space-y-4'>
                        <h3 className='text-lg font-medium'>
                            Education
                        </h3>
                        <Controller
                        name='education'
                        control={control}
                        render={({field})=>(
                            <EntryForm
                            type={'Education'}
                            entries={field.value}
                            onChange={field.onChange}
                            />
                            
                        )}
                        />
                        {errors.education && (
                            <p className='text-sm text-red-500'>
                                {errors.education.message}
                            </p>
                        )}
                    </div>

                        <div className='space-y-4'>
                        <h3 className='text-lg font-medium'>
                            Projects
                        </h3>
                        <Controller
                        name='projects'
                        control={control}
                        render={({field})=>(
                        <EntryForm
                            type={'Project'}
                            entries={field.value}
                            onChange={field.onChange}
                            />
                            
                        )}
                        />
                        {errors.projects && (
                            <p className='text-sm text-red-500'>
                                {errors.projects.message}
                            </p>
                        )}
                    </div>

                </form>
            </TabsContent>
            <TabsContent value="preview">
                <Button
                variant={'link'}
                type='button'
                className={'mb-2'}
                onClick={()=>setresumeMode(resumeMode === 'preview'?'edit':'preview')}
                >
                    {resumeMode==='preview' ?(
                        <>
                        <Edit className='h-4 w-4'/>
                        Edit Resume
                        </>
                    ):(
                        <>
                        <Monitor className='h-4 w-4'/>
                        Show Preview
                        </>
                    )}
                

                </Button>
                {resumeMode!=='preview' && (
                    <div className='flex p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded mb-2'>
                        <AlertTriangle className='h-5 w-5'/>
                        <span className='text-sm'>
                            You will lose edited markdown if you update the form data.
                        </span>

                    </div>
                )}
                <div className='border rounded-lg'>
                    <MarkdownEditor
                    value={previewContent}
                    onChange={setpreviewContent}
                    height={800}
                    preview={resumeMode}
                    />

                </div>
                <div className='hidden'>
                    <div id='resume-pdf'>
                        <MarkdownEditor.Markdown
                        source={previewContent}
                        style={{
                            background:'white',
                            color:'black'
                        }}
                        />
                    </div>

                </div>
            </TabsContent>
        </Tabs>
    </div>
  )
}

export default ResumeBuilder
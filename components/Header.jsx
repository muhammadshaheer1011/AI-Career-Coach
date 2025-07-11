import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { ChevronDown, FileText, GraduationCap, LayoutDashboard, PenBox, StarsIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { checkUser } from '@/lib/checkUser'

const Header = async() => {
  await checkUser()
  return (
 <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
    <nav className='container mx-auto px-4 h-16 flex items-center justify-between'>
        <Link href={'/'}>
        <Image
        src="/logo.png" alt='SensAI Logo' width={240} height={80}
        className='h-12 py-1 w-auto object-contain'
        />

        </Link>
        <div className='flex items-center space-x-2 md:space-x-4'>
            <SignedIn>
                <Link href={'/dashboard'}>
                <Button variant={'outline'}>
                    <LayoutDashboard className='h-4 w-4'/>
                    <span className='hidden md:block'>
                    Industry Insights
                    </span>
                        
                </Button>
                </Link>


            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button>
                    <StarsIcon className='h-4 w-4'/>
                    <span className='hidden md:block'>
                    Growth Tools
                    </span>
                    <ChevronDown className='h-4 w-4'/>
                        
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='min-w-[200px'>
               <DropdownMenuItem> 
                <FileText className='h-4 w-4'/>
                <Link href={'/resume'} className='flex-items-center gap-2 w-full'>
                     Build Resume
                </Link>
               </DropdownMenuItem>
                <DropdownMenuItem>
                <PenBox className='h-4 w-4'/>
                <Link href={'/ai-cover-letter'} className='flex-items-center gap-2 w-full'>
                Cover Letter 
                </Link>
               </DropdownMenuItem>
                <DropdownMenuItem>
                
                <GraduationCap className='h-4 w-4'/>
                <Link href={'/interview'} className='flex-items-center gap-2 w-full'>
                    Interview Prep

                </Link>
               </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
            </SignedIn>

            <SignedOut>
              <SignInButton>
                <Button variant={'outline'}>
                    Sign In
                </Button>
              </SignInButton>
              <SignUpButton>
                <button className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton 
              appearance={{
                elements:{
                    avatarBox:'w-10 h-10',
                    userButtonPopoverCard:'shadow-xl',
                    userPreviewMainIdentifier:'font-semibold',
                },
              }}
              afterSignOutUrl='/'
              />
            </SignedIn>
        </div>
    </nav>



          </header>
  )
}

export default Header
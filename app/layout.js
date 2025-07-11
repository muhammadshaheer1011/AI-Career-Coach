import { Inter} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import { Toaster } from "@/components/ui/sonner";

const inter=Inter({
  subsets:["latin"]
});

export const metadata = {
  title: "AI Career Coach",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
    appearance={{
      baseTheme:dark
    }}
    >
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className}`}
      >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            
            {/* header */}
            <Header/>
            <main className="min-h-screen">{children}</main>
            <Toaster richColors />

            {/* footer */}
            <footer className="bg-muted/50 py-12">
              <div className="container:mx-auto px-4 text-center text-gray-200 flex flex-col items-center gap-2">
              <span>
                Made by Muhammad Shaheer Uddin Siddiqui
              </span>
              <div className="flex gap-4 justify-center">
                <a href="https://www.linkedin.com/in/muhammad-shaheer-uddin-siddiqui-878140263/"
                target="_blank"
                rel="nooopner noreferrer"
                className="hover:text-blue-400">
                  <FaLinkedin size={24}/>
                </a>
                
                <a href="https://github.com/muhammadshaheer1011"
                target="_blank"
                rel="nooopner noreferrer"
                className="hover:text-gray-400">
                  <FaGithub size={24}/>
                </a>

                <a 
                href="mailto:muhammadshaheer1011@gmail.com"
                className="hover:text-gray-400">
                  <FaEnvelope size={24}/>
                </a>
              </div>
              </div>
            </footer>
          </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}

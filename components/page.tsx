'use client'

import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, MessageCircle, Share, ThumbsDown, ThumbsUp, Handshake, TrendingUp, Zap, LogOut, Settings, HelpCircle, BarChart, FileText, Target, Brain, Mic, Menu } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, SignedIn, SignedOut, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';


type Message = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

type ExpertType = 'General' | 'Negotiations' | 'Sales' | 'Motivation'

const TopicIntroduction: React.FC<{ topic: ExpertType; onAskQuestion: (question: string) => void }> = ({ topic, onAskQuestion }) => {
  const topicData = {
    General: {
      icon: <Brain className="w-12 h-12 md:w-16 md:h-16" />,
      description: "Your personal AI Coach for various aspects of professional and personal development.",
      questions: [
        { icon: <HelpCircle />, text: "How can AI real estate coaching benefit me?" },
        { icon: <Target />, text: "What areas can you assist me with?" },
        { icon: <MessageCircle />, text: "How do I get started with AI real-estate coaching?" },
        { icon: <FileText />, text: "Can you explain your coaching methodology?" },
      ],
    },
    Negotiations: {
      icon: <Handshake className="w-12 h-12 md:w-16 md:h-16" />,
      description: "Master the art of win-win outcomes and effective communication.",
      questions: [
        { icon: <HelpCircle />, text: "What are some common mistakes to avoid during real estate negotiations?" },
        { icon: <MessageCircle />, text: "What are some effective negotiation techniques?" },
        { icon: <Target />, text: "How to negotiate with difficult personalities?" },
        { icon: <FileText />, text: "How should I handle counteroffers from sellers or buyers?" },
      ],
    },
    Sales: {
      icon: <TrendingUp className="w-12 h-12 md:w-16 md:h-16" />,
      description: "Boost your sales performance with expert strategies and techniques.",
      questions: [
        { icon: <HelpCircle />, text: "What are the key elements of a successful real estate sales pitch?" },
        { icon: <MessageCircle />, text: "How can I improve my cold calling skills?" },
        { icon: <Target />, text: "What are effective closing techniques in real estate sales?" },
        { icon: <BarChart />, text: "How to analyze and improve sales metrics?" },
      ],
    },
    Motivation: {
      icon: <Zap className="w-12 h-12 md:w-16 md:h-16" />,
      description: "Unlock your potential with powerful motivation and goal-setting strategies.",
      questions: [
        { icon: <HelpCircle />, text: "How can I stay motivated during a down-market in real estate?" },
        { icon: <Target />, text: "What are some effective goal-setting techniques?" },
        { icon: <MessageCircle />, text: "How to overcome procrastination and boost productivity?" },
        { icon: <FileText />, text: "Can you suggest daily habits for maintaining motivation?" },
      ],
    },
  }

  const data = topicData[topic]

  return (
    <div className="flex flex-col items-center justify-center space-y-6 md:space-y-8 max-w-2xl mx-auto mb-8 px-4">
      <div className="text-blue-400">{data.icon}</div>
      <h2 className="text-xl md:text-2xl font-bold text-white text-center">{topic}</h2>
      <p className="text-center text-gray-300 text-sm md:text-base">{data.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {data.questions.map((question, index) => (
          <Card key={index} className="cursor-pointer hover:bg-gray-800 bg-gray-900" onClick={() => onAskQuestion(question.text)}>
            <CardContent className="flex items-start p-4">
              <div className="mr-4 mt-1 text-blue-400">{question.icon}</div>
              <p className="text-sm text-gray-300">{question.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function HeroSection() {
  const rotatingTexts = [
    "Real Estate Marketing Strategy",
    "Sales Pitch",
    "Marketing Budget",
    "Negotiating Tactic",
    "Motivational Quote",
  ];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const router = useRouter();
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % rotatingTexts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-blue-500  text-white py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center mb-6"
          >
            {/* <AgentCoachLogo /> */}
            <h1 className="text-4xl font-bold ml-4">AgentCoach.ai</h1>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl font-bold mb-4"
          >
            Generate A Brilliant
          </motion.h2>
          <div className="h-20 mb-4 relative">
            <AnimatePresence mode='wait'>
              <motion.p
                key={currentTextIndex}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="text-5xl font-bold text-[#3b82f6] absolute w-full"
              >
                {rotatingTexts[currentTextIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-5xl font-bold mb-8 text-white"
          >
            In Seconds
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button onClick={()=>router.push("/signin")} size="lg" className="bg-white text-black hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#0a0a0a] opacity-90"></div>
        <svg className="absolute bottom-0 left-0 right-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#ffffff" fillOpacity="0.1" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,213.3C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
}

export function Page() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [currentExpert, setCurrentExpert] = useState<ExpertType>('General')
  const [isListening, setIsListening] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const { signOut } = useClerk()

  // useEffect(() => {
  //   if (isLoaded && !isSignedIn) {
  //     router.push('/signin'); 
  //   }
  // }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (message: string) => {
    if (message.trim()) {
      const userMessage: Message = { role: 'user', content: message };
      setMessages(prev => [...prev, userMessage]);
      
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            chatbot: currentExpert.toLowerCase(), // Convert to lowercase
          }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
  
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } catch (error) {
        console.error('Error:', error);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error. Please try again.' 
        }]);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage(inputValue)
    setInputValue('')
  }

  const handleExpertClick = (expert: ExpertType) => {
    setCurrentExpert(expert)
    setMessages([])
    setIsSidebarOpen(false)
  }

  const handleAskQuestion = (question: string) => {
    handleSendMessage(question)
  }

  const toggleListening = () => {
    if (!isListening) {
      setIsListening(true)
      // Start voice recognition here
      // When voice input is received, set it to inputValue
      // setInputValue(voiceInput)
      // setIsListening(false)
    } else {
      setIsListening(false)
      // Stop voice recognition here
    }
  }

  const getAIAvatar = (expert: ExpertType) => {
    if (expert === 'General') {
      return (
        <AvatarImage src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2%20copy-FNVfXcGRjKO97dR4JbmOnzv21Ov8LM.png" alt="AI" />
      )
    } else {
      const IconComponent = expert === 'Negotiations' ? Handshake : expert === 'Sales' ? TrendingUp : Zap
      return (
        <div className="w-full h-full rounded-full border-2 border-blue-400 flex items-center justify-center bg-gray-800">
          <IconComponent className="w-5 h-5 text-blue-400" />
        </div>
      )
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <SignedIn>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 bg-gray-800 text-white">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-300 hover:text-white hover:bg-gray-700 md:hidden mr-2" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-LNqJvtMncHrGgssgeeVhV3hMJV8k6Z.png" 
            alt="AgentCoach.ai Logo" 
            className="h-8 md:h-12"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-700 md:hidden">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-700 md:hidden">
            <LogOut className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-700 hidden md:flex">
            <Settings className="h-5 w-5 mr-2" />
            Settings
          </Button>
          <Button onClick={() => signOut({ redirectUrl: '/' })} variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-700 hidden md:flex">
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden pt-16"> {/* Added pt-16 for header height */}
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block fixed md:relative z-20 w-64 h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] bg-gray-900 border-r border-gray-700 transition-all duration-300 ease-in-out overflow-y-auto`}>
        <Button
            variant="ghost"
            className="flex items-center justify-center h-16 w-full border-b border-gray-700 text-white hover:text-white hover:bg-gray-800"
            onClick={() => handleExpertClick('General')}
          >
            <MessageCircle className="h-6 w-6 mr-2" />
            <span className="font-semibold">Your AI Coach</span>
          </Button>
          <div className="p-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Chat with an AI expert in:</h3>
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800" onClick={() => handleExpertClick('Negotiations')}>
              <Handshake className="mr-2 h-4 w-4" />
              Negotiations
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800" onClick={() => handleExpertClick('Sales')}>
              <TrendingUp className="mr-2 h-4 w-4" />
              Sales
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800" onClick={() => handleExpertClick('Motivation')}>
              <Zap className="mr-2 h-4 w-4" />
              Motivation
            </Button>
          </div>
        </div>
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-900 overflow-hidden">
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4 min-h-[calc(100vh-12rem)]">
              {messages.length === 0 ? (
                <div className="pt-8">
                  <TopicIntroduction topic={currentExpert} onAskQuestion={handleAskQuestion} />
                </div>
              ) : (
                messages.map((message, index) => (
                  <div key={index} className={`flex items-start space-x-4 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      {message.role === 'user' ? (
                        <AvatarImage src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-7v1yfECIgEfyIYRs3CwfoJ3J8wagYT.png" alt="User" className="object-cover" />
                      ) : (
                        getAIAvatar(currentExpert)
                      )}
                    </Avatar>
                    <div className="space-y-2 max-w-[70%] md:max-w-[80%]">
                    <div className={`p-3 rounded-lg ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}>
                      <ReactMarkdown
                        components={{
                          p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                          strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                    {message.role === 'assistant' && (
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
                          <ThumbsDown className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
                          <Share className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>
          </ScrollArea>
          <div className="border-t border-gray-700 p-4">
            <form onSubmit={handleFormSubmit} className="flex space-x-2">
              <Input 
                className="flex-1 bg-gray-800 text-white border-gray-700 focus:border-blue-400"
                placeholder="Write a message..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Button type="button" size="icon" onClick={toggleListening} className="bg-gray-800 text-gray-300 hover:text-white">
                <Mic className={`h-4 w-4 ${isListening ? 'text-red-500' : ''}`} />
              </Button>
              <Button type="submit" size="icon" className="bg-blue-600 text-white hover:bg-blue-700">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-xs text-gray-500 mt-2 text-center">
              © 2024 AgentCoach.ai. All rights reserved.
            </p>
          </div>
        </div>
      </div>
      </SignedIn>

      <SignedOut>
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white">
      <HeroSection />
    </div>
  </SignedOut>

    </div>
  )
}
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageCircle
} from "lucide-react";

import { useAuth, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import 'react-toastify/dist/ReactToastify.css';
import ChatSidebar from "@/components/chatSideBar";
import HeaderBar from "@/components/header";
import TopicIntroduction from "@/components/topicIntroduction";
import SpeechToText from "@/components/speechToText";


type ExpertType = 'General' | 'Real Estate' | 'Sales' | 'Marketing' | 'Negotiation' | 'Motivation';

export function Page() {
  const [inputValue, setInputValue] = useState("");
  const [currentExpert, setCurrentExpert] = useState<ExpertType>("General");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isLoaded, isSignedIn, userId } = useAuth();
  const router = useRouter();
  const { signOut } = useClerk();
  const supabaseUrl = "https://sgvvrdovhronhpykdgje.supabase.co";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";
  const supabase = createClient(supabaseUrl, supabaseKey);


  useEffect(() => {
    
    async function fetchUserDetails() {
      
      if (isLoaded && isSignedIn) {
     
        const { data: user, error } = await supabase
          .from("user")
          .select("user_id")
          .eq("user_id", userId);

          if (Boolean(user) && user !== null && user.length === 0) {
            const { data, error } = await supabase
              .from("user")
              .insert([{ user_id: userId }])
              .select();
          }
      }
    }
    fetchUserDetails();
  }, [isLoaded, isSignedIn]);

  

  const handleSendMessage = async (message: string) => {
    if (message.trim()) {
      try {
        const chatId = uuidv4();
        const { data, error } = await supabase
          .from("chat")
          .insert([
            { chat_id: chatId, user_id: userId, coach_type: currentExpert },
          ])
          .select();
         
        router.push(`/chat/${chatId}?ques=${message}&new=true`);
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
    setInputValue("");
  };

  const handleExpertClick = (expert: ExpertType) => {
    setCurrentExpert(expert);
    setIsSidebarOpen(false);
  };

  const handleAskQuestion = (question: string) => {
    handleSendMessage(question);
  };


  const handleTranscription = (transcribedText: string) => {
    setInputValue((prev) => `${prev} ${transcribedText}`);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">

        {/* Header */}
        <HeaderBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} signOut={signOut}/>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden pt-16">
          {" "}
          {/* Added pt-16 for header height */}
          {/* Sidebar */}
          <ChatSidebar userId={userId} supabase={supabase} isSidebarOpen={isSidebarOpen} handleExpertClick={handleExpertClick} />


          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col bg-gray-900 overflow-hidden">
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4 min-h-[calc(100vh-12rem)]">

                  <div className="pt-8">
                    <TopicIntroduction
                      topic={currentExpert}
                      onAskQuestion={handleAskQuestion}
                    />
                  </div>
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
                 {/* Use SpeechToText component */}
                 <SpeechToText onTranscribe={handleTranscription} />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-blue-600 text-white hover:bg-blue-700">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </form>
              <p className="text-xs text-gray-500 mt-2 text-center">
                © 2024 AgentCoach.ai. All rights reserved.
              </p>
            </div>
          </div>
        </div>

    </div>
  );
}

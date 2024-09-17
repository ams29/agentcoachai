"use client";

import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { toast, ToastContainer } from 'react-toastify';
import genderNeutralAvatar from "@/components/avatar/gender neutral avatar.jpg";
import 'react-toastify/dist/ReactToastify.css';
import {
  ArrowRight,
  MessageCircle,
  Share,
  ThumbsDown,
  ThumbsUp,
  Handshake,
  TrendingUp,
  Zap,
  LogOut,
  Settings,
  HelpCircle,
  BarChart,
  FileText,
  Target,
  Brain,
  Mic,
  Menu,
  Megaphone,
  Home,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import { format } from "date-fns";
import fs from "fs";
import ChatSidebar from "@/components/chatSideBar";
import HeaderBar from "@/components/header";
import TopicIntroduction from "@/components/topicIntroduction";
import SpeechToText from "@/components/speechToText";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
  order: number;
  user_id: string;
  chat_id: string;
  message_id: string;
  like:number
};
type Props = {
  params: {
    chat_id: string;
  };
};


type ExpertType = 'General' | 'Real Estate' | 'Sales' | 'Marketing' | 'Negotiation' | 'Motivation';


export default function Page({ params: { chat_id } }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [inputValue, setInputValue] = useState("");
  let newRoute = false;
  const [currentExpert, setCurrentExpert] = useState<ExpertType>("General");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { userId } = useAuth();
  const router = useRouter();
  const { signOut } = useClerk();
  const supabaseUrl = "https://sgvvrdovhronhpykdgje.supabase.co";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";
  const supabase = createClient(supabaseUrl, supabaseKey);
  const searchParam = useSearchParams();

  useEffect(() => {
    if (Boolean(searchParam.get("new")) ) {
      if(newRoute) return;
      newRoute=true;
      handleSendMessage(searchParam.get("ques") || "");
      router.replace(`/chat/${chat_id}`, undefined);
      return;
    }

    const fetchMessages = async () => {
      const { data: messages, error } = await supabase
        .from("message")
        .select()
        .eq("chat_id", chat_id)
        .eq("user_id", userId);


      if (messages) {
        const sortedMessages = messages.sort((a, b) => {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        });
        
        setMessages(sortedMessages);
        // handleSendMessage(searchParam.get("ques") || "");
      }
    };

    if (userId && chat_id) {
      fetchMessages();
    }
  }, []);


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if(!isSidebarOpen) handleAskQuestion(message);
    if (isSending) return;
    setIsSending(true);
  
    if (message.trim()) {
      const prevOrder = messages.length > 0 ? messages[messages.length - 1].order : 0;
      const prevLength=messages.length; 

      const userMessage: Message = {
        role: "user",
        content: message,
        user_id: userId || "",
        order: prevOrder + 1,
        chat_id: chat_id,
        message_id: uuidv4(),
        like: 0,
      };
  
      // Insert user message into the database
      const { data: supabaseData, error: supabaseError } = await supabase
        .from("message")
        .insert([userMessage])
        .select();
  
      if (supabaseError) {
        console.error("Supabase error:", supabaseError);
        setIsSending(false);
        return;
      }
  
      setMessages((prev) => [...prev, userMessage]);
  
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            chatbot: currentExpert.toLowerCase(), 
            expert: currentExpert,
          }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let done = false;
        
        const assistanceuuid=uuidv4();
        const assistantMessage: Message = { role: 'assistant', content: '',
          user_id: userId || "",
          order: prevOrder + 2,
          chat_id: chat_id,
          message_id: assistanceuuid,
          like: 0,
         };

        setMessages((prev) => [...prev, assistantMessage]);
  
        // Capture index for assistant message
        const assistantMessageIndex = prevLength+1;
        
        const newMessages = [...messages, userMessage, assistantMessage];
  
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          const chunkValue = decoder.decode(value);
  
          // Update assistant message content progressively
          newMessages[assistantMessageIndex].content += chunkValue;
          
          // Update the state with the progressively updated message
          setMessages([...newMessages]);
        }
  
        const systemMessage: Message = {
          role: "assistant",
          content: newMessages[assistantMessageIndex].content, // Use the final content from assistantMessage
          user_id: userId || "",
          order: prevOrder + 2,
          chat_id: chat_id,
          message_id: assistanceuuid,
          like: 0,
        };
  
        // Insert assistant message (system message) into the database
        const { data: systemSupabaseData, error: systemSupabaseError } = await supabase
          .from("message")
          .insert([systemMessage])
          .select();
  
        if (systemSupabaseError) {
          console.error("Error inserting system message into Supabase:", systemSupabaseError);
        }
  
        // Update state with the final assistant message
        // setMessages((prev) => [...prev, systemMessage]);
      } catch (error) {
        console.error("Error:", error);
        const errorMessage : Message={
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          user_id: userId || "",
          order: prevOrder + 2,
          chat_id: chat_id,
          message_id: uuidv4(),
          like: 0,
        };
        setMessages((prev) => [
          ...prev,
          errorMessage,
        ]);
        const { data: supabaseData, error: supabaseError } = await supabase
        .from("message")
        .insert([userMessage])
        .select();
      } finally {
        // Reset sending state
        setIsSending(false);
      }
    }
  };
  



  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
    setInputValue("");
  };

  const handleAskQuestion = async (message: string) => {
    if (message.trim()) {
      try {
        toast.success('You are being redirected pls wait', {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
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
    // handleSendMessage(question);
  };

  const handleShare = (chatId: string) => {
    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/chat/${chatId}`;
    
    // Copy URL to clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
      // Show a toast notification
      toast.success('Copied to clipboard!', {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };
  

  const getAIAvatar = (expert: ExpertType) => {
    let IconComponent;
    switch (expert) {
      case 'General':
        return (
          <AvatarImage
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2%20copy-FNVfXcGRjKO97dR4JbmOnzv21Ov8LM.png"
            alt="AI"
          />
        );
      case 'Real Estate':
        IconComponent = Home;
        break;
      case 'Negotiation':
        IconComponent = Handshake;
        break;
      case 'Sales':
        IconComponent = TrendingUp;
        break;
      case 'Motivation':
        IconComponent = Zap;
        break;
      case 'Marketing':
        IconComponent = Megaphone;
        break;
      default:
        IconComponent = Brain;
    }
    return (
      <div className="w-full h-full rounded-full border-2 border-blue-400 flex items-center justify-center bg-gray-800">
        <IconComponent className="w-5 h-5 text-blue-400" />
      </div>
    );
  };

  const handleLike = async (messageId: string, likeValue: number) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.message_id === messageId ? { ...msg, like: likeValue } : msg
      )
    );
    
    if (likeValue === 1) {
      toast.success('You liked this message!', {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (likeValue === -1) {
      toast.error('You disliked this message!', {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    // Update the 'like' field in the database
    const { data, error } = await supabase
      .from("message")
      .update({ like: likeValue })
      .eq("message_id", messageId).select();
    if (error) {
      console.error("Error updating like value:", error);
    }
  };
  const handleExpertClick = (expert: ExpertType) => {
    setCurrentExpert(expert);
    setMessages([]);
    setIsSidebarOpen(false);
  };
  
  const handleTranscription = (transcribedText: string) => {
    setInputValue((prev) => `${prev} ${transcribedText}`);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <SignedIn>
      
         {/* Header */}
         <HeaderBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} signOut={signOut}/>
        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden pt-16">
          {" "}
          {/* Added pt-16 for header height */}

          <ChatSidebar userId={userId} supabase={supabase} isSidebarOpen={isSidebarOpen} handleExpertClick={handleExpertClick} />
          {/* Main Chat Area */}
         
          <div className="flex-1 flex flex-col bg-gray-900 overflow-hidden">
            <ScrollArea className="flex-1">
              
              <div className="p-4 space-y-4 min-h-[calc(100vh-12rem)]">
              {messages.length === 0 ? (
                  <div className="pt-8">
                    <TopicIntroduction
                      topic={currentExpert}
                      onAskQuestion={handleAskQuestion}
                    />
                  </div>
                ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start space-x-4 ${
                      message.role === "user"
                        ? "flex-row-reverse space-x-reverse"
                        : ""
                    }`}>
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      {message.role === "user" ? (
                        <AvatarImage
                          src="https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg"
                          alt="User"
                          className="object-cover"
                        />
                      ) : (
                        getAIAvatar(currentExpert)
                      )}
                    </Avatar>
                    <div className="space-y-2 max-w-[70%] md:max-w-[80%]">
                      <div
                        className={`p-3 rounded-lg ${
                          message.role === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-800 text-gray-300"
                        }`}>
                        <ReactMarkdown
                          components={{
                            p: ({ node, ...props }) => (
                              <p className="mb-2" {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                              <ul className="list-disc pl-4 mb-2" {...props} />
                            ),
                            ol: ({ node, ...props }) => (
                              <ol
                                className="list-decimal pl-4 mb-2"
                                {...props}
                              />
                            ),
                            li: ({ node, ...props }) => (
                              <li className="mb-1" {...props} />
                            ),
                            strong: ({ node, ...props }) => (
                              <strong className="font-bold" {...props} />
                            ),
                          }}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                      {message.role === "assistant" && (
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleLike(message.message_id, 1)}
                            className={`${
                              message.like === 1
                                ? "text-blue-400"
                                : "text-gray-400 hover:text-white hover:bg-gray-800"
                            }`}>
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleLike(message.message_id, -1)}
                            className={`${
                              message.like === -1
                                ? "text-red-400"
                                : "text-gray-400 hover:text-white hover:bg-gray-800"
                            }`}>
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleShare(chat_id)}
                            className="text-gray-400 hover:text-white hover:bg-gray-800">
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
      </SignedIn>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import 'react-toastify/dist/ReactToastify.css';
import { MessageCircle, Handshake, TrendingUp, Zap, Brain, Home, Megaphone } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

type ChatPreview = {
  chat_id: string;
  firstMessage: string;
  created_at: string;
  coach_type: string;
};

function ChatHistory({ userId, supabase }: any) {
  const [chatPreviews, setChatPreviews] = useState<ChatPreview[]>([]);

  useEffect(() => {
    const fetchChatPreviews = async () => {
      const { data: chats, error } = await supabase
        .from("chat")
        .select(`
              chat_id, 
              created_at, 
              coach_type,
              messages:message(
                content, 
                created_at
              )
            `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1, { foreignTable: "message" });
      if (error) {
        console.error("Error fetching chat previews:", error);
        return;
      }

      const chatPreviews = chats.map((chat: any) => {
        const firstMessageContent =
          chat.messages.length > 0 ? chat.messages[0].content : "No messages yet";
        const firstMessagePreview =
          firstMessageContent.split(" ").slice(0, 3).join(" ") +
          (firstMessageContent.split(" ").length > 3 ? "..." : "");

        return {
          chat_id: chat.chat_id,
          firstMessage: firstMessagePreview,
          created_at: chat.created_at,
          coach_type: chat.coach_type,
        };
      });

      setChatPreviews(chatPreviews);
    };

    fetchChatPreviews();
  }, []);

  return (
    <div className="w-64 h-screen text-white bg-gray-900"> {/* Background color consistent with sidebar */}
      <hr className="border-gray-700"></hr>
      <h2 className="flex items-center justify-center text-xl font-semibold p-4 text-gray-100 ">Chat History</h2> {/* Font size and color matched */}
      <ScrollArea className="h-[calc(100vh-4rem)] p-2">
        {chatPreviews.length > 0 ? (
          chatPreviews.map((chat) => (
            <Link key={chat.chat_id} href={`/chat/${chat.chat_id}`}>
              <div className="flex items-center space-x-4 p-3 hover:bg-gray-800 rounded-lg cursor-pointer">
                {/* Hover effect matched */}
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src="https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg"
                    alt="User"
                    className="object-cover"
                  />
                </Avatar>
                <div>
                  <p className="text-sm text-gray-300">{chat.firstMessage}</p> {/* Font color matched */}
                  <p className="text-xs text-gray-500">
                    {format(new Date(chat.created_at), "dd/MM/yyyy")}{" "}
                    <span className="text-sm text-gray-400">{chat.coach_type}</span>
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-400 p-4">No chats available.</p>
        )}
      </ScrollArea>
    </div>
  );
}

export default function Sidebar({ isSidebarOpen, userId, supabase, handleExpertClick }: any) {
  return (
    <div
      className={`${
        isSidebarOpen ? "block" : "hidden"
      } md:block fixed md:relative z-20 w-64 h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] bg-gray-900 border-r border-gray-700 transition-all duration-300 ease-in-out overflow-y-auto`}
    >
      <Button
            variant="ghost"
            className="flex items-center justify-center h-16 w-full border-b border-gray-700 text-white hover:text-white hover:bg-gray-800"
            onClick={() => handleExpertClick('General')}
          >
            <Brain className="h-6 w-6 mr-2" />
            <span className="font-semibold">Your AI Coach</span>
          </Button>
          <div className="p-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Chat with an AI expert in:</h3>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
              onClick={() => handleExpertClick('Real Estate')}
            >
              <Home className="mr-2 h-4 w-4" />
              Real Estate
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
              onClick={() => handleExpertClick('Sales')}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Sales
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
              onClick={() => handleExpertClick('Marketing')}
            >
              <Megaphone className="mr-2 h-4 w-4" />
              Marketing
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
              onClick={() => handleExpertClick('Negotiation')}
            >
              <Handshake className="mr-2 h-4 w-4" />
              Negotiation
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
              onClick={() => handleExpertClick('Motivation')}
            >
              <Zap className="mr-2 h-4 w-4" />
              Motivation
            </Button>
          </div>
      <ChatHistory userId={userId} supabase={supabase} />
    </div>
  );
}

"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

import {

  MessageCircle,
  Handshake,
  TrendingUp,
  Zap,
  HelpCircle,
  BarChart,
  FileText,
  Target,
  Brain,
  Megaphone,
  Home,
} from "lucide-react";

type ExpertType = 'General' | 'Real Estate' | 'Sales' | 'Marketing' | 'Negotiation' | 'Motivation';

 const TopicIntroduction: React.FC<{
    topic: ExpertType;
    onAskQuestion: (question: string) => void;
  }> = ({ topic, onAskQuestion }) => {
    const topicData = {
      General: {
        icon: <Brain className="w-12 h-12 md:w-16 md:h-16" />,
        description: 'Your personal AI Coach for various aspects of professional and personal development.',
        questions: [
          { icon: <HelpCircle />, text: 'How can AI real estate coaching benefit me?' },
          { icon: <Target />, text: 'What areas can you assist me with?' },
          { icon: <MessageCircle />, text: 'How do I get started with AI real-estate coaching?' },
          { icon: <FileText />, text: 'Can you explain your coaching methodology?' },
        ],
      },
      'Real Estate': {
        icon: <Home className="w-12 h-12 md:w-16 md:h-16" />,
        description: 'Get expert advice on real estate industry insights and practices.',
        questions: [
          { icon: <HelpCircle />, text: 'What are the current trends in the real estate market?' },
          { icon: <MessageCircle />, text: 'How can I improve my real estate investment strategies?' },
          { icon: <Target />, text: 'What are some tips for first-time home buyers?' },
          { icon: <FileText />, text: 'How does location affect property value?' },
        ],
      },
      Sales: {
        icon: <TrendingUp className="w-12 h-12 md:w-16 md:h-16" />,
        description: 'Boost your sales performance with expert strategies and techniques.',
        questions: [
          { icon: <HelpCircle />, text: 'What are the key elements of a successful real estate sales pitch?' },
          { icon: <MessageCircle />, text: 'How can I improve my cold calling skills?' },
          { icon: <Target />, text: 'What are effective closing techniques in real estate sales?' },
          { icon: <BarChart />, text: 'How to analyze and improve sales metrics?' },
        ],
      },
      Marketing: {
        icon: <Megaphone className="w-12 h-12 md:w-16 md:h-16" />,
        description: 'Enhance your marketing strategies and communication skills in real estate.',
        questions: [
          { icon: <HelpCircle />, text: 'What are effective marketing strategies for real estate agents?' },
          { icon: <MessageCircle />, text: 'How can I improve my communication with clients?' },
          { icon: <Target />, text: 'What role does social media play in real estate marketing?' },
          { icon: <FileText />, text: 'Can you suggest ways to improve my online presence?' },
        ],
      },
      Negotiation: {
        icon: <Handshake className="w-12 h-12 md:w-16 md:h-16" />,
        description: 'Master the art of win-win outcomes and effective communication.',
        questions: [
          { icon: <HelpCircle />, text: 'What are some common mistakes to avoid during real estate negotiations?' },
          { icon: <MessageCircle />, text: 'What are some effective negotiation techniques?' },
          { icon: <Target />, text: 'How to negotiate with difficult personalities?' },
          { icon: <FileText />, text: 'How should I handle counteroffers from sellers or buyers?' },
        ],
      },
      Motivation: {
        icon: <Zap className="w-12 h-12 md:w-16 md:h-16" />,
        description: 'Unlock your potential with powerful motivation and goal-setting strategies.',
        questions: [
          { icon: <HelpCircle />, text: 'How can I stay motivated during a down-market in real estate?' },
          { icon: <Target />, text: 'What are some effective goal-setting techniques?' },
          { icon: <MessageCircle />, text: 'How to overcome procrastination and boost productivity?' },
          { icon: <FileText />, text: 'Can you suggest daily habits for maintaining motivation?' },
        ],
      },
    };
  
    const data = topicData[topic];
  
    return (
      <div className="flex flex-col items-center justify-center space-y-6 md:space-y-8 max-w-2xl mx-auto mb-8 px-4">
        <div className="text-blue-400">{data.icon}</div>
        <h2 className="text-xl md:text-2xl font-bold text-white text-center">{topic}</h2>
        <p className="text-center text-gray-300 text-sm md:text-base">{data.description}</p>
        <p className="text-center text-gray-300 text-sm md:text-base">
          Click one of the sample questions below or type your own question!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {data.questions.map((question, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:bg-gray-800 bg-gray-900"
              onClick={() => onAskQuestion(question.text)}
            >
              <CardContent className="flex items-start p-4">
                <div className="mr-4 mt-1 text-blue-400">{question.icon}</div>
                <p className="text-sm text-gray-300">{question.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

export default TopicIntroduction;
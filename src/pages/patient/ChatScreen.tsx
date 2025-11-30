import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Mic, 
  MicOff, 
  Phone, 
  Video, 
  MoreVertical,
  ArrowLeft,
  Clock,
  Check,
  CheckCheck
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { t } from '../../utils/translations';

interface Message {
  id: string;
  senderId: string;
  senderType: 'patient' | 'doctor';
  content: string;
  type: 'text' | 'voice' | 'image';
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

interface ChatScreenProps {
  consultationId: string;
  doctorInfo: {
    id: string;
    name: string;
    avatar: string;
    specialty: string;
    isOnline: boolean;
  };
}

export default function ChatScreen({ consultationId, doctorInfo }: ChatScreenProps) {
  const { state } = useApp();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load existing messages
    loadMessages();
    
    // Set up real-time message listening
    // In a real app, this would connect to Firebase or Socket.IO
    const interval = setInterval(() => {
      // Simulate receiving messages
      if (Math.random() > 0.95) {
        receiveMessage();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = () => {
    // Simulate loading existing messages
    const sampleMessages: Message[] = [
      {
        id: '1',
        senderId: doctorInfo.id,
        senderType: 'doctor',
        content: `Hello! I'm ${doctorInfo.name}. How can I help you today?`,
        type: 'text',
        timestamp: new Date(Date.now() - 300000),
        status: 'read'
      },
      {
        id: '2',
        senderId: state.user?.id || '',
        senderType: 'patient',
        content: 'Hi doctor, I\'ve been having headaches for the past few days.',
        type: 'text',
        timestamp: new Date(Date.now() - 240000),
        status: 'read'
      }
    ];
    setMessages(sampleMessages);
  };

  const receiveMessage = () => {
    const doctorResponses = [
      "I understand. Can you tell me more about the headaches?",
      "How often do you experience these headaches?",
      "Are you taking any medications currently?",
      "Let me know if you have any other symptoms."
    ];
    
    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: doctorInfo.id,
      senderType: 'doctor',
      content: doctorResponses[Math.floor(Math.random() * doctorResponses.length)],
      type: 'text',
      timestamp: new Date(),
      status: 'delivered'
    };
    
    setMessages(prev => [...prev, newMsg]);
    setIsTyping(false);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: state.user?.id || '',
      senderType: 'patient',
      content: newMessage,
      type: 'text',
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Simulate doctor typing
    setTimeout(() => setIsTyping(true), 1000);
    
    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id ? { ...msg, status: 'delivered' } : msg
        )
      );
    }, 1000);
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    // Implement voice recording logic
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    // Process and send voice message
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Check className="w-4 h-4 text-gray-400" />;
      case 'delivered': return <CheckCheck className="w-4 h-4 text-gray-400" />;
      case 'read': return <CheckCheck className="w-4 h-4 text-emerald-500" />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/home')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="relative">
            <img
              src={doctorInfo.avatar}
              alt={doctorInfo.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
              doctorInfo.isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`} />
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800">{doctorInfo.name}</h3>
            <p className="text-sm text-gray-600">
              {doctorInfo.isOnline ? 'Online' : 'Last seen recently'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Video className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.senderType === 'patient' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
              message.senderType === 'patient'
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-gray-800 shadow-sm'
            }`}>
              <p className="text-sm">{message.content}</p>
              <div className={`flex items-center justify-end space-x-1 mt-1 ${
                message.senderType === 'patient' ? 'text-emerald-100' : 'text-gray-500'
              }`}>
                <span className="text-xs">{formatTime(message.timestamp)}</span>
                {message.senderType === 'patient' && getMessageStatusIcon(message.status)}
              </div>
            </div>
          </motion.div>
        ))}
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white text-gray-800 shadow-sm px-4 py-2 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('typeMessage', state.currentLanguage)}
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
            className={`p-3 rounded-full transition-colors ${
              isRecording 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="p-3 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
// Same as previous ChatWindow code
import React, { useState, useEffect, useRef } from "react";
import supabase from "../components/supabaseClient";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API;

const ChatWindow = ({ userId, username, isPublicChat }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const aiUserId = `${userId.slice(0, 4)}a100-0000-0000-0000-000000000000`;

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });

  const fetchMessages = async () => {
    const table = isPublicChat ? "public_chats" : "private_chats";
    let query = supabase
      .from(table)
      .select("id, user_id, sender, username, message, created_at")
      .order("created_at", { ascending: true })
      .order("id", { ascending: true });

    if (!isPublicChat) {
      query = query.in("user_id", [userId, aiUserId]);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setMessages(data || []);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [userId, isPublicChat]);

  useEffect(() => {
    const table = isPublicChat ? "public_chats" : "private_chats";
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table,
          filter: isPublicChat
            ? undefined
            : `user_id=in.(${userId},${aiUserId})`,
        },
        (payload) => {
          console.log("Insert:", payload);
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table,
          filter: isPublicChat
            ? undefined
            : `user_id=in.(${userId},${aiUserId})`,
        },
        (payload) => {
          console.log("Update:", payload);
          setMessages((prev) =>
            prev.map((msg) => (msg.id === payload.new.id ? payload.new : msg))
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table,
          filter: isPublicChat
            ? undefined
            : `user_id=in.(${userId},${aiUserId})`,
        },
        (payload) => {
          console.log("Delete:", payload);
          setMessages((prev) =>
            prev.filter((msg) => msg.id !== payload.old.id)
          );
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, isPublicChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    setIsLoading(true);
    const table = isPublicChat ? "public_chats" : "private_chats";
    const hasAiFlag = inputText.includes("-ai");
    const messageToSend = hasAiFlag
      ? inputText.replace("-ai", "").trim()
      : inputText;

    try {
      console.log(
        "Sending message with userId:",
        userId,
        "username:",
        username
      );
      console.log("AI userId:", aiUserId);
      const { data: userMessage, error: userError } = await supabase
        .from(table)
        .insert({
          user_id: userId,
          sender: "user",
          username: username,
          message: messageToSend,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (userError) throw userError;

      if (!isPublicChat || (isPublicChat && hasAiFlag)) {
        const aiResponse = await generateAIResponse(messageToSend);
        const { error: aiError } = await supabase.from(table).insert({
          user_id: aiUserId,
          sender: "ai",
          username: "AI",
          message: aiResponse,
          created_at: new Date().toISOString(),
        });

        if (aiError) throw aiError;
      }

      setInputText("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = async (inputText) => {
    try {
      if (isPublicChat) {
        const { data: recentMessages } = await supabase
          .from("public_chats")
          .select("sender, username, message")
          .order("created_at", { ascending: false })
          .limit(5);

        const context = recentMessages
          .reverse()
          .map((msg) => `${msg.username}: ${msg.message}`)
          .join("\n");

        const prompt = `You’re an AI user in a public chat with multiple people. Here’s the recent conversation:\n${context}\nNow respond to this message as part of the group: "${inputText}"`;
        const result = await model.generateContent(prompt);
        return result.response.text();
      } else {
        const prompt = `You’re a friendly AI chatting one-on-one with a user. Respond naturally to: "${inputText}"`;
        const result = await model.generateContent(prompt);
        return result.response.text();
      }
    } catch (error) {
      console.error("Error generating AI response:", error);
      return "Oops, I couldn’t think of a reply!";
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={
              msg.sender === "ai"
                ? "ai-message"
                : msg.user_id === userId
                ? "user-message"
                : "other-user-message"
            }
          >
            <span className="message-sender">{msg.username} :</span>
            <span className="message-text">{msg.message}</span>
          </div>
        ))}
        {isLoading && <div className="typing-indicator">AI is typing...</div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-area">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            isPublicChat
              ? "Type a message (use -ai for AI reply)"
              : "Type a message..."
          }
          disabled={isLoading}
          className="chat-input"
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading}
          className="send-button"
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;

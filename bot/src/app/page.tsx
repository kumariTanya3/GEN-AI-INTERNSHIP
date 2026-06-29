
/*//chatgpt generated prompted code 3(updated ui, and file system, and copy and share option, image extraction feature added)-
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { extractTextFromImage } from "@/utils/ocrWorker";

interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const [pdfContent, setPdfContent] = useState<string>("");
  const [imageContent, setImageContent] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js";
    script.onload = () => {
      if ((window as any).pdfjsLib) {
        (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
      }
    };
    document.body.appendChild(script);
  }, []);

  const handleSend = async (): Promise<void> => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const tempAiMessage: Message = {
      id: Date.now() + 1,
      sender: "ai",
      text: "AI is generating response...",
    };
    setMessages((prev) => [...prev, tempAiMessage]);

    const combinedText = input.trim() + "\n\n" + pdfContent + "\n" + imageContent;

    const contents = messages.concat({ ...userMessage, text: combinedText }).map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key= GEMINI_API_KEY",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contents }),
        }
      );

      const data = await response.json();
      const aiText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "AI couldn't generate a response.";

      setMessages((prev) => [
        ...prev.filter((msg) => msg.text !== "AI is generating response..."),
        {
          id: Date.now() + 2,
          sender: "ai",
          text: aiText,
        },
      ]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages((prev) => [
        ...prev.filter((msg) => msg.text !== "AI is generating response..."),
        {
          id: Date.now() + 2,
          sender: "ai",
          text: "Something went wrong while fetching AI response.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") handleSend();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    if (file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = async () => {
        const typedArray = new Uint8Array(reader.result as ArrayBuffer);
        const pdfjsLib = (window as any).pdfjsLib;

        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item: any) => item.str);
          fullText += strings.join(" ") + "\n";
        }

        console.log("Parsed PDF content:\n", fullText);
        setPdfContent(fullText);
      };
      reader.readAsArrayBuffer(file);
    } else if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        try {
          const text = await extractTextFromImage(dataUrl);
          console.log("OCR Text:", text);
          setImageContent(text);
        } catch (err) {
          console.error("OCR failed:", err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4 md:p-10">
      <h1 className="text-center text-2xl font-bold uppercase mb-4">AI Assistant</h1>
      <Card className="flex flex-col flex-grow rounded-2xl overflow-hidden shadow-xl">
        <CardContent className="flex flex-col flex-grow p-4">
          <ScrollArea className="flex-grow space-y-3 overflow-y-auto pr-2 h-[60vh]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "rounded-xl p-3 max-w-md whitespace-pre-wrap",
                    msg.sender === "user"
                      ? "bg-blue-100 text-right"
                      : "bg-gray-200 text-left"
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {fileName && (
              <div className="text-sm text-center text-gray-500">
                1 file uploaded: {fileName}
              </div>
            )}
          </ScrollArea>
          <div className="mt-4 flex flex-col gap-2 md:flex-row">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="flex-grow"
              disabled={loading}
            />
            <Button onClick={handleSend} disabled={loading}>
              {loading ? "Sending..." : "Send"}
            </Button>
          </div>
          <div className="mt-2">
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="text-sm"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatBot;
*/


//chatgpt generated prompted code 3(updated ui, and file system, and copy and share option, image extraction feature added - but some files were not present)-
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Copy, Share } from "lucide-react";

interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const [pdfText, setPdfText] = useState<string>("");
  const [imageText, setImageText] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js";
    script.onload = () => {
      if ((window as any).pdfjsLib) {
        (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
      }
    };
    document.body.appendChild(script);
  }, []);

  const handleSend = async (): Promise<void> => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const tempAiMessage: Message = {
      id: Date.now() + 1,
      sender: "ai",
      text: "AI is generating response...",
    };
    setMessages((prev) => [...prev, tempAiMessage]);

    const combinedText = `${input.trim()}\n\n${pdfText}\n\n${imageText}`.trim();

    const contents = [
      ...messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      })),
      { role: "user", parts: [{ text: combinedText }] },
    ];

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key= GEMINI_API_KEY",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents }),
        }
      );

      const data = await response.json();
      const aiText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "AI couldn't generate a response.";

      setMessages((prev) => [
        ...prev.filter((msg) => msg.text !== "AI is generating response..."),
        {
          id: Date.now() + 2,
          sender: "ai",
          text: aiText,
        },
      ]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages((prev) => [
        ...prev.filter((msg) => msg.text !== "AI is generating response..."),
        {
          id: Date.now() + 2,
          sender: "ai",
          text: "Something went wrong while fetching AI response.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") handleSend();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    if (file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = async () => {
        const typedArray = new Uint8Array(reader.result as ArrayBuffer);
        const pdfjsLib = (window as any).pdfjsLib;
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item: any) => item.str);
          fullText += strings.join(" ") + "\n";
        }
        setPdfText(fullText);
        console.log("Parsed PDF content:\n", fullText);
      };
      reader.readAsArrayBuffer(file);
    } else if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = async () => {
        const worker = await import("tesseract.js");
        const result = await worker.recognize(reader.result as string, "eng");
        setImageText(result.data.text);
        console.log("Extracted image text:\n", result.data.text);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleShare = (text: string) => {
    const shareUrl = `https://myshare.com/shared?msg=${encodeURIComponent(
      text
    )}`;
    alert(`Share this link: ${shareUrl}`);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-10">
      <h1 className="text-center text-2xl font-bold uppercase mb-4 text-cyan-300">
        TECHI CHAT
      </h1>
      <Card className="flex flex-col flex-grow rounded-2xl bg-gray-800 overflow-hidden shadow-xl">
        <CardContent className="flex flex-col flex-grow p-4">
          <ScrollArea className="flex-grow space-y-4 overflow-y-auto pr-2 h-[60vh]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start gap-2",
                  msg.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "rounded-xl px-4 py-3 max-w-md relative",
                    msg.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-white"
                  )}
                >
                  {msg.text}
                  {msg.sender === "ai" && (
                    <div className="absolute top-1 right-2 flex gap-2">
                      <Copy
                        className="w-4 h-4 cursor-pointer"
                        onClick={() => handleCopy(msg.text)}
                      />
                      <Share
                        className="w-4 h-4 cursor-pointer"
                        onClick={() => handleShare(msg.text)}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>
  
          <div className="mt-4 flex flex-col gap-2 md:flex-row">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="flex-grow bg-gray-900 text-white border border-gray-600"
              disabled={loading}
            />
            <Button onClick={handleSend} disabled={loading} className="bg-cyan-600 hover:bg-cyan-500">
              {loading ? "Sending..." : "Send"}
            </Button>
          </div>
  
          {/* File Upload and Display Section */}
          <div className="mt-4 flex flex-col md:flex-row gap-4 items-center">
            <label className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded cursor-pointer shadow-md transition-all duration-150 ease-in-out">
              Choose File
              <input
                type="file"
                accept="application/pdf,image/*"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="hidden"
              />
            </label>
  
            {fileName && (
              <div className="bg-white text-gray-900 px-3 py-2 rounded-md shadow-sm text-sm max-w-xs truncate">
                {fileName}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );  
};
export default ChatBot;

// prev file(not updates and colourless 'choose file')-  
// return (
//     <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-10">
//       <h1 className="text-center text-2xl font-bold uppercase mb-4 text-cyan-300">
//         AI Assistant
//       </h1>
//       <Card className="flex flex-col flex-grow rounded-2xl bg-gray-800 overflow-hidden shadow-xl">
//         <CardContent className="flex flex-col flex-grow p-4">
//           <ScrollArea className="flex-grow space-y-4 overflow-y-auto pr-2 h-[60vh]">
//             {messages.map((msg) => (
//               <div
//                 key={msg.id}
//                 className={cn(
//                   "flex items-start gap-2",
//                   msg.sender === "user" ? "justify-end" : "justify-start"
//                 )}
//               >
//                 <div
//                   className={cn(
//                     "rounded-xl px-4 py-3 max-w-md relative",
//                     msg.sender === "user"
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-700 text-white"
//                   )}
//                 >
//                   {msg.text}
//                   {msg.sender === "ai" && (
//                     <div className="absolute top-1 right-2 flex gap-2">
//                       <Copy
//                         className="w-4 h-4 cursor-pointer"
//                         onClick={() => handleCopy(msg.text)}
//                       />
//                       <Share
//                         className="w-4 h-4 cursor-pointer"
//                         onClick={() => handleShare(msg.text)}
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//             {fileName && (
//               <div className="text-sm text-center text-gray-400">
//                 1 file uploaded: {fileName}
//               </div>
//             )}
//           </ScrollArea>
//           <div className="mt-4 flex flex-col gap-2 md:flex-row">
//             <Input
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={handleKeyPress}
//               placeholder="Type your message..."
//               className="flex-grow bg-gray-900 text-white border border-gray-600"
//               disabled={loading}
//             />
//             <Button onClick={handleSend} disabled={loading} className="bg-cyan-600 hover:bg-cyan-500">
//               {loading ? "Sending..." : "Send"}
//             </Button>
//           </div>
//           <div className="mt-2">
//             <input
//               type="file"
//               accept="application/pdf,image/*"
//               onChange={handleFileUpload}
//               ref={fileInputRef}
//               className="text-sm text-white"
//             />
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };




/*//chatgpt generated prompted code 3(updated ui, and file system, and copy and share option)-
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Copy, Share2 } from "lucide-react";

interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const [pdfText, setPdfText] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js";
    script.onload = () => {
      if ((window as any).pdfjsLib) {
        (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
      }
    };
    document.body.appendChild(script);
  }, []);

  const handleSend = async (): Promise<void> => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const tempAiMessage: Message = {
      id: Date.now() + 1,
      sender: "ai",
      text: "AI is generating response...",
    };
    setMessages((prev) => [...prev, tempAiMessage]);

    const contents = messages.concat(userMessage).map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    // Append PDF content to the current user message
    contents.push({
      role: "user",
      parts: [{ text: pdfText }],
    });

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key= KEY",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contents }),
        }
      );

      const data = await response.json();

      const aiText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "AI couldn't generate a response.";

      setMessages((prev) => [
        ...prev.filter((msg) => msg.text !== "AI is generating response..."),
        {
          id: Date.now() + 2,
          sender: "ai",
          text: aiText,
        },
      ]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages((prev) => [
        ...prev.filter((msg) => msg.text !== "AI is generating response..."),
        {
          id: Date.now() + 2,
          sender: "ai",
          text: "Something went wrong while fetching AI response.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") handleSend();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = async () => {
        const typedArray = new Uint8Array(reader.result as ArrayBuffer);
        const pdfjsLib = (window as any).pdfjsLib;

        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item: any) => item.str);
          fullText += strings.join(" ") + "\n";
        }

        console.log("Parsed PDF content:\n", fullText);
        setPdfText(fullText);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleShare = (text: string) => {
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/plain" })
    );
    prompt("Share this URL:", url);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 md:p-10">
      <h1 className="text-center text-3xl font-bold uppercase mb-4 tracking-wider text-cyan-400">TechChat AI</h1>
      <Card className="flex flex-col flex-grow rounded-2xl overflow-hidden bg-gray-950/70 shadow-xl border border-gray-700">
        <CardContent className="flex flex-col flex-grow p-4">
          <ScrollArea className="flex-grow space-y-4 overflow-y-auto pr-2 h-[60vh]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start",
                  msg.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "relative rounded-xl p-3 max-w-md whitespace-pre-wrap",
                    msg.sender === "user"
                      ? "bg-blue-600 text-right text-white"
                      : "bg-gray-700 text-left text-white"
                  )}
                >
                  {msg.text}
                  {msg.sender === "ai" && (
                    <div className="absolute top-1 right-2 flex gap-1">
                      <Copy
                        size={16}
                        className="cursor-pointer text-gray-400 hover:text-white"
                        onClick={() => handleCopy(msg.text)}
                      />
                      <Share2
                        size={16}
                        className="cursor-pointer text-gray-400 hover:text-white"
                        onClick={() => handleShare(msg.text)}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {fileName && (
              <div className="text-xs text-center text-gray-400">
                1 file uploaded: {fileName}
              </div>
            )}
          </ScrollArea>
          <div className="mt-4 flex flex-col gap-2 md:flex-row">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="flex-grow text-black"
              disabled={loading}
            />
            <Button onClick={handleSend} disabled={loading} className="bg-cyan-500 hover:bg-cyan-600">
              {loading ? "Sending..." : "Send"}
            </Button>
          </div>
          <div className="mt-2">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="text-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatBot;
*/

/*
//chatgpt generated prompted code 3(updated ui, and file system)-
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const [pdfContent, setPdfContent] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js";
    script.onload = () => {
      if ((window as any).pdfjsLib) {
        (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
      }
    };
    document.body.appendChild(script);
  }, []);

  const handleSend = async (): Promise<void> => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const tempAiMessage: Message = {
      id: Date.now() + 1,
      sender: "ai",
      text: "AI is generating response...",
    };
    setMessages((prev) => [...prev, tempAiMessage]);

    const contents = messages
      .concat(userMessage)
      .filter((msg) => msg.text !== "AI is generating response...")
      .map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

    if (pdfContent) {
      contents.push({
        role: "user",
        parts: [{ text: `PDF Content: \n${pdfContent}` }],
      });
    }

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key= KEY",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contents }),
        }
      );

      const data = await response.json();
      const aiText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "AI couldn't generate a response.";

      setMessages((prev) => [
        ...prev.filter((msg) => msg.text !== "AI is generating response..."),
        { id: Date.now() + 2, sender: "ai", text: aiText },
      ]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages((prev) => [
        ...prev.filter((msg) => msg.text !== "AI is generating response..."),
        {
          id: Date.now() + 2,
          sender: "ai",
          text: "Something went wrong while fetching AI response.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") handleSend();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = async () => {
        const typedArray = new Uint8Array(reader.result as ArrayBuffer);
        const pdfjsLib = (window as any).pdfjsLib;
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item: any) => item.str);
          fullText += strings.join(" ") + "\n";
        }

        console.log("Parsed PDF content:\n", fullText);
        setPdfContent(fullText);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleShare = (text: string) => {
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, "_blank");
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 md:p-10">
      <h1 className="text-center text-3xl font-bold uppercase mb-4 tracking-wide text-cyan-400">AI Assistant</h1>
      <Card className="flex flex-col flex-grow rounded-2xl backdrop-blur-xl bg-white/10 overflow-hidden shadow-xl">
        <CardContent className="flex flex-col flex-grow p-4">
          <ScrollArea className="flex-grow space-y-3 overflow-y-auto pr-2 h-[60vh]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "rounded-xl p-4 max-w-md relative group",
                    msg.sender === "user"
                      ? "bg-gradient-to-br from-indigo-500 to-blue-600 text-white"
                      : "bg-gray-700 text-white"
                  )}
                >
                  {msg.text}
                  {msg.sender === "ai" && (
                    <div className="absolute top-1 right-1 hidden group-hover:flex space-x-2">
                      <button
                        onClick={() => handleCopy(msg.text)}
                        className="text-xs text-gray-300 hover:text-white"
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => handleShare(msg.text)}
                        className="text-xs text-gray-300 hover:text-white"
                      >
                        Share
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {fileName && (
              <div className="text-sm text-center text-gray-400 italic">
                1 file uploaded: {fileName}
              </div>
            )}
          </ScrollArea>
          <div className="mt-4 flex flex-col gap-2 md:flex-row">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="flex-grow bg-gray-900 text-white border-none"
              disabled={loading}
            />
            <Button onClick={handleSend} disabled={loading} className="bg-cyan-500 hover:bg-cyan-600">
              {loading ? "Sending..." : "Send"}
            </Button>
          </div>
          <div className="mt-2">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="text-sm text-white file:bg-purple-600 file:text-white file:rounded-full file:px-4 file:py-1 file:cursor-pointer"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatBot;
*/


/*
//chatgpt generated prompted code 2(updated ui)-
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const [pdfText, setPdfText] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js";
    script.onload = () => {
      if ((window as any).pdfjsLib) {
        (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
      }
    };
    document.body.appendChild(script);
  }, []);

  const handleSend = async (): Promise<void> => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const tempAiMessage: Message = {
      id: Date.now() + 1,
      sender: "ai",
      text: "AI is generating response...",
    };
    setMessages((prev) => [...prev, tempAiMessage]);

    const contents = messages
      .concat(userMessage)
      .map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

    // Append PDF content as user context
    if (pdfText.trim()) {
      contents.push({
        role: "user",
        parts: [{ text: pdfText.trim() }],
      });
    }

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key= KEY",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contents }),
        }
      );

      const data: {
        candidates: {
          content: {
            parts: { text: string }[];
            role: string;
          };
          finishReason: string;
          avgLogprobs: number;
        }[];
      } = await response.json();

      const aiText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "AI couldn't generate a response.";

      setMessages((prev) => [
        ...prev.filter((msg) => msg.text !== "AI is generating response..."),
        {
          id: Date.now() + 2,
          sender: "ai",
          text: aiText,
        },
      ]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages((prev) => [
        ...prev.filter((msg) => msg.text !== "AI is generating response..."),
        {
          id: Date.now() + 2,
          sender: "ai",
          text: "Something went wrong while fetching AI response.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") handleSend();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = async () => {
        const typedArray = new Uint8Array(reader.result as ArrayBuffer);
        const pdfjsLib = (window as any).pdfjsLib;

        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item: any) => item.str);
          fullText += strings.join(" ") + "\n";
        }

        console.log("Parsed PDF content:\n", fullText);
        setPdfText(fullText);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-zinc-900 via-gray-900 to-slate-800 p-6 md:p-10 text-white font-sans">
      <h1 className="text-center text-3xl font-extrabold tracking-widest text-cyan-400 mb-6 drop-shadow-md">
        ✨ AI Assistant Chat ✨
      </h1>
      <Card className="flex flex-col flex-grow rounded-2xl shadow-2xl backdrop-blur-md bg-white/10 border border-white/10">
        <CardContent className="flex flex-col flex-grow p-6">
          <ScrollArea className="flex-grow space-y-4 overflow-y-auto pr-2 h-[60vh] custom-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "rounded-2xl px-5 py-3 max-w-md text-sm md:text-base transition-all duration-300",
                    msg.sender === "user"
                      ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
                      : "bg-gradient-to-br from-gray-700 to-gray-600 text-white"
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {fileName && (
              <div className="text-sm text-center text-gray-300 italic">
                📎 1 file uploaded: {fileName}
              </div>
            )}
          </ScrollArea>
          <div className="mt-6 flex flex-col gap-3 md:flex-row">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="flex-grow bg-gray-900 text-white placeholder-gray-400 border border-gray-700"
              disabled={loading}
            />
            <Button
              onClick={handleSend}
              disabled={loading}
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold"
            >
              {loading ? "Sending..." : "Send"}
            </Button>
          </div>
          <div className="mt-3">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-600 file:text-white hover:file:bg-violet-700"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatBot;
*/

/*
//chatgpt generated prompted code 1-
'useState'
"use client"
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: input.trim(),
    };

    const aiReply: Message = {
      id: Date.now() + 1,
      sender: "ai",
      text: `You said: "${input.trim()}".`,
    };

    setMessages((prev) => [...prev, userMessage, aiReply]);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4 md:p-10">
      <h1 className="text-center text-2xl font-bold uppercase mb-4">AI Assistant</h1>
      <Card className="flex flex-col flex-grow rounded-2xl overflow-hidden shadow-xl">
        <CardContent className="flex flex-col flex-grow p-4">
          
          <ScrollArea className="h-[60vh] space-y-3 pr-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "rounded-xl p-3 max-w-md",
                    msg.sender === "user"
                      ? "bg-blue-100 text-right"
                      : "bg-gray-200 text-left"
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </ScrollArea>
          <div className="mt-4 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button onClick={handleSend}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatBot;
*/


/*
//prev model - already generated-
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Our latest Bot
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
  */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, FileText, Users, Languages, Send, Sparkles, Download, Printer, 
  Search, Plus, CheckCircle2, Clock, AlertCircle, Building2, Globe, 
  Volume2, ShieldCheck, RefreshCw, Copy, Check, Menu, X, ArrowRight
} from 'lucide-react';

type Language = 'am' | 'en' | 'om' | 'so' | 'ti';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface CitizenRequest {
  id: string;
  trackingNumber: string;
  citizenName: string;
  serviceType: string;
  office: string;
  status: 'Pending' | 'In Review' | 'Approved' | 'Completed';
  date: string;
  phone: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'docs' | 'queue' | 'translate'>('chat');
  const [lang, setLang] = useState<Language>('am');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Translations dictionary for UI
  const t = {
    am: {
      brand: "ግርማይክ ቴክኖሎጂ (ድሬዳዋ)",
      subtitle: "የህዝብ አገልግሎት እና አስተዳደር ኤአይ ረዳት",
      navChat: "የኤአይ ረዳት (Chat)",
      navDocs: "ደብዳቤ & ሪፖርት ማዘጋጃ",
      navQueue: "የህብረተሰብ ጥያቄዎች (Queue)",
      navTranslate: "የቋንቋ පරිርጉም",
      welcomeBanner: "እንኳን ወደ ግርማይክ ቴክኖሎጂ የድሬዳዋ አስተዳደር ኤአይ ረዳት በደህና መጡ!",
      bannerDesc: "በድሬዳዋ ከተማ አስተዳደር እና በኢትዮጵያ መንግስታዊ መስሪያ ቤቶች ውስጥ የስራ ጫናን የሚቀንስ፣ ደብዳቤዎችን የሚያዘጋጅ፣ እና አገልግሎቶችን የሚያቀላጥፍ ዘመናዊ መድረክ።",
      chatPlaceholder: "ጥያቄዎን ወይም ትዕዛዝዎን እዚህ ይጻፉ (ለምሳሌ፦ 'ለወረዳ 02 አስተዳደር የሚሆን የቢሮ እቃዎች ግዥ ደብዳቤ አዘጋጅልኝ')...",
      send: "ላክ",
      generating: "እየተዘጋጀ ነው...",
      copy: "ኮፒ አድርግ",
      copied: "ተኮርጅቷል!",
      download: "አውርድ (TXT)",
      print: "አትም",
      quickPromptsHeader: "ፈጣን መጠይቆች (Quick Prompts):",
      prompt1: "ለከተማ መሬት ልማት ቢሮ የሚሆን የሪፖርት ማጠቃለያ አዘጋጅ",
      prompt2: "የሰራተኞች የስራ ሰዓት ማክበር ማሳሰቢያ ደብዳቤ ጻፍ",
      prompt3: "የድሬዳዋን የኢንቨስትመንት እድሎች አብራራ",
      prompt4: "የውሃ እና ፍሳሽ አገልግሎት ጥያቄ ቅጽ አዘጋጅ",
      docType: "የሰነድ ዓይነት",
      letter: "ይፋዊ ደብዳቤ (Official Letter)",
      report: "የስራ ክንውን ሪፖርት (Performance Report)",
      memo: "የውስጥ ማስታወሻ (Memo)",
      summary: "የሰነድ ማጠቃለያ (Summary)",
      topicLabel: "ርዕስ ወይም ዋና ሀሳብ",
      detailsLabel: "ተጨማሪ ማብራሪያዎች / ዝርዝር ሁኔታ",
      generateBtn: "ሰነድ ፍጠር (Generate)",
      queueTitle: "የህብረተሰብ አገልግሎት ጥያቄዎች ክትትል",
      addRequest: "አዲስ ጥያቄ መዝግብ",
      citizenName: "የአመልካች ስም",
      serviceType: "የአገልግሎቱ ዓይነት",
      officeName: "የታለመው መስሪያ ቤት",
      statusLabel: "ሁኔታ",
      actions: "እርምጃዎች",
      searchPlaceholder: "በአመልካች ስም ወይም መለያ ቁጥር ፈልግ...",
      translateTitle: "ባለብዙ ቋንቋ පරිርጉም (Multi-lingual Translator)",
      sourceText: "ተርጓሚ ጽሁፍ (Source Text)",
      targetLang: "የሚተረጎምበት ቋንቋ",
      translateBtn: "ተርጎም (Translate)",
      resultText: "የተተረጎመ ጽሁፍ",
      footer: "© 2026 ግርማይክ ቴክኖሎጂ ትሬዲንግ ዋን ሜምበር ፒኤልሲ - ድሬዳዋ፣ ኢትዮጵያ"
    },
    en: {
      brand: "Girmaic Tech (Dire Dawa)",
      subtitle: "Public Service & Administrative AI Assistant",
      navChat: "AI Assistant",
      navDocs: "Document & Report Generator",
      navQueue: "Citizen Queue & Requests",
      navTranslate: "Multi-lingual Translator",
      welcomeBanner: "Welcome to Girmaic Technology Dire Dawa Administration AI Assistant!",
      bannerDesc: "Empowering Dire Dawa City Administration and Ethiopian public offices to reduce workload, draft official correspondence, and streamline public services.",
      chatPlaceholder: "Type your query or instruction here (e.g., 'Draft an office supply request letter for Kebele 02')...",
      send: "Send",
      generating: "Generating...",
      copy: "Copy",
      copied: "Copied!",
      download: "Download (TXT)",
      print: "Print",
      quickPromptsHeader: "Quick Prompts:",
      prompt1: "Draft a performance report for urban land development",
      prompt2: "Write an official staff punctuality memo",
      prompt3: "Explain investment incentives in Dire Dawa",
      prompt4: "Create a water and sewerage service request template",
      docType: "Document Type",
      letter: "Official Letter",
      report: "Performance Report",
      memo: "Internal Memo",
      summary: "Document Summary",
      topicLabel: "Topic or Main Subject",
      detailsLabel: "Additional Details / Requirements",
      generateBtn: "Generate Document",
      queueTitle: "Citizen Service Request & Queue Tracker",
      addRequest: "Register New Request",
      citizenName: "Citizen Name",
      serviceType: "Service Type",
      officeName: "Target Office",
      statusLabel: "Status",
      actions: "Actions",
      searchPlaceholder: "Search by citizen name or tracking ID...",
      translateTitle: "Multi-lingual Administrative Translator",
      sourceText: "Source Text",
      targetLang: "Target Language",
      translateBtn: "Translate",
      resultText: "Translated Output",
      footer: "© 2026 Girmaic Technology Trading One Member PLC - Dire Dawa, Ethiopia"
    },
    om: {
      brand: "Girmaic Tech (Dire Dawa)",
      subtitle: "Gargaaraa AI Tajaajila Hawaasaa",
      navChat: "Gargaaraa AI",
      navDocs: "Qopheessaa Galmee & Gabaasaa",
      navQueue: "Gaaffii Hawaasaa (Queue)",
      navTranslate: "Afaan Hiikaa",
      welcomeBanner: "Baga Nagaan Dhuftan gara Gargaaraa AI Bulchiinsa Dirree Dawaa!",
      bannerDesc: "Bulchiinsa Magaalaa Dirree Dawaa fi dhaabbilee mootummaa Itoophiyaa keessatti hojii salphisuuf, xalayaa qopheessuuf fi tajaajila saffisiisuuf kan qophaa'e.",
      chatPlaceholder: "Gaaffii keessan asitti barreessaa (fkn: 'Xalayaa gaaffii meeshaa biiroo qopheessi')...",
      send: "Ergi",
      generating: "Qophaa'aa jira...",
      copy: "Koppii godhi",
      copied: "Koppii ta'eera!",
      download: "Buufadhu (TXT)",
      print: "Maxxansi",
      quickPromptsHeader: "Gaaffiiwwan Saffisaa:",
      prompt1: "Gabaasa raawwii hojii misooma lafaatiif qopheessi",
      prompt2: "Xalayaa hubachiisa yeroo hojii barreessi",
      prompt3: "Carraalee invastimantii Dirree Dawaa ibsi",
      prompt4: "Unka gaaffii tajaajila bishaanii uumi",
      docType: "Gosa Galmee",
      letter: "Xalayaa Mootummaa",
      report: "Gabaasa Raawwii",
      memo: "Hubachiisa Keessoo",
      summary: "Gabaabumsa Galmee",
      topicLabel: "Mata Duree Yookan Yaada Ijoo",
      detailsLabel: "Ibsa Dabalataa",
      generateBtn: "Galmee Uumi",
      queueTitle: "Hordoffii Gaaffii Tajaajila Hawaasaa",
      addRequest: "Gaaffii Haaraa Galmeessi",
      citizenName: "Maqaa Lammiif",
      serviceType: "Gosa Tajaajila",
      officeName: "Biroo Barbaadame",
      statusLabel: "Haala",
      actions: "T noqa",
      searchPlaceholder: "Maqaa lammiitiin barbaadi...",
      translateTitle: "Hiikaa Afaanota Hedduu",
      sourceText: "Barreeffama Maddee",
      targetLang: "Afaan Hiikamuu Qabu",
      translateBtn: "Hiikuu",
      resultText: "Bu'aa Hiikame",
      footer: "© 2026 Girmaic Technology Trading One Member PLC - Dirree Dawaa, Itoophiyaa"
    },
    so: {
      brand: "Girmaic Tech (Dire Dawa)",
      subtitle: "Kaaliyaha AI ee Adeegga Bulshada",
      navChat: "Kaaliyaha AI",
      navDocs: "Abuuuraha Waraaqaha & Warbixinta",
      navQueue: "Codsiyada Bulshada (Queue)",
      navTranslate: "Turjumaanka Luuqadaha",
      welcomeBanner: "Ku soo dhowow Kaaliyaha AI ee Maamulka Magaalada Dire Dawa!",
      bannerDesc: "Waxaa loogu talagalay in lagu fududeeyo shaqada xafiisyada dowladda, diyaarinta warqadaha rasmi ah, iyo dardargelinta adeegga bulshada.",
      chatPlaceholder: "Halkan ku qor su'aashaada ama amarkaaga...",
      send: "Dir",
      generating: "Waa la diyaarinayaa...",
      copy: "Nuqul ka qaado",
      copied: "La nuqulsaday!",
      download: "Soo dejiso (TXT)",
      print: "Daabaco",
      quickPromptsHeader: "Talooyin Degdeg ah:",
      prompt1: "Diyaari warbixinta horumarinta dhulka magaalada",
      prompt2: "Qor warqad digniin ah oo ku saabsan waqtiga shaqada",
      prompt3: "Sharax fursadaha maalgashiga ee Dire Dawa",
      prompt4: "Samee foomka codsiga adeegga biyaha iyo fayadhowrka",
      docType: "Nooca Waraaqda",
      letter: "Warqad Rasmiga ah",
      report: "Warbixinta Waxqabadka",
      memo: "Xusuusin Gudaha ah",
      summary: "Kooban Warqadda",
      topicLabel: "Mowduuca ama Qodobka Muhiimka ah",
      detailsLabel: "Faahfaahin Dheeraad ah",
      generateBtn: "Soo saar Dukumeentiga",
      queueTitle: "La socodka Codsiyada Adeegga Bulshada",
      addRequest: "Diiwaangeli Codsi Cusub",
      citizenName: "Magaca Muwaadinka",
      serviceType: "Nooca Adeegga",
      officeName: "Xafiiska La Beegsanayo",
      statusLabel: "Xaaladda",
      actions: "Tallaabooyinka",
      searchPlaceholder: "Ka raadi magaca ama lambarka aqoonsiga...",
      translateTitle: "Turjumaanka Maamulka ee Luuqadaha Badan",
      sourceText: "Qoraalka Asalka ah",
      targetLang: "Luuqadda la turjumayo",
      translateBtn: "Turjun",
      resultText: "Natiijada Turjuman",
      footer: "© 2026 Girmaic Technology Trading One Member PLC - Dire Dawa, Itoobiya"
    },
    ti: {
      brand: "ግርማይክ ቴክኖሎጂ (ድሬዳዋ)",
      subtitle: "ናይ ህዝቢ ግልጋሎትን ምምሕዳርን ኤአይ ሓጋዚ",
      navChat: "ናይ ኤአይ ሓጋዚ (Chat)",
      navDocs: "ደብዳቤ & ሪፖርት መዳለዊ",
      navQueue: " ሕቶታት ህዝቢ (Queue)",
      navTranslate: "ቋንቋ ተርጓሚ",
      welcomeBanner: "እንቋዕ ናብ ግርማይክ ቴክኖሎጂ ናይ ድሬዳዋ አስተዳደር ኤአይ ሓጋዚ ብደሓን መጻእኹም!",
      bannerDesc: "ኣብ ድሬዳዋ ከተማ አስተዳደርን በኢትዮጵያ መንግስታዊ ቤት ጽሕፈታትን ናይ ስራ ጽዕንቶ ዝቕንስ፣ ደብዳቤታትን ሪፖርታትን ዘዳሉ ዘመናዊ መድረኽ።",
      chatPlaceholder: "ሕቶኹም ወይ ትእዛዝኩም ኣብዚ ጽሐፉ...",
      send: "ልእኽ",
      generating: "ይዳሎ ኣሎ...",
      copy: "ኮፒ ግበር",
      copied: "ተኮሪጁ ኣሎ!",
      download: "ኣውርድ (TXT)",
      print: "ሕተም",
      quickPromptsHeader: "ቅልጡፍ ሕቶታት (Quick Prompts):",
      prompt1: "ንከተማ መሬት ልማት ቢሮ ዝኸውን ጽማቝ ሪፖርት ኣዳልዎ",
      prompt2: "ናይ ሰራሕተኛታት ሰዓት ኣከባብራ መጠንቀቕታ ደብዳቤ ጽሓፍ",
      prompt3: "ናይ ድሬዳዋ ናይ ኢንቨስትመንት ዕድላት ኣብርህ",
      prompt4: "ናይ ማይን ፍሳሽን ግልጋሎት ሕቶ ቅጥዒ ኣዳልዎ",
      docType: "ዓይነት ሰነድ",
      letter: "ወግዓዊ ደብዳቤ (Official Letter)",
      report: "ናይ ስራ ክንውን ሪፖርት (Performance Report)",
      memo: "ውሽጣዊ መዘክር (Memo)",
      summary: "ጽማቝ ሰነድ (Summary)",
      topicLabel: "ኣርእስቲ ወይ ቀንዲ ሓሳብ",
      detailsLabel: "ተወሳኺ መግለጺታት / ዝርዝር ኩነታት",
      generateBtn: "ሰነድ ፍጠር (Generate)",
      queueTitle: "ናይ ህዝቢ ግልጋሎት ሕቶታት ክትትል",
      addRequest: "ሓዲሽ ሕቶ መዝግብ",
      citizenName: "ሽም ኣመልካቲ",
      serviceType: "ዓይነት ግልጋሎት",
      officeName: "ዕላማ ዘለዎ ቤት ጽሕፈት",
      statusLabel: "ኩነታት",
      actions: " ስጉምትታት",
      searchPlaceholder: "ብሽም ኣመልካቲ ወይ መለለዪ ቁጽሪ ድለ...",
      translateTitle: "ብዙሕ ቋንቋ ተርጓሚ (Multi-lingual Translator)",
      sourceText: "መበቆላዊ ጽሑፍ (Source Text)",
      targetLang: "ዝትርጐመሉ ቋንቋ",
      translateBtn: "ተርጐም (Translate)",
      resultText: "ዝተተርጐመ ጽሑፍ",
      footer: "© 2026 ግርማይክ ቴክኖሎጂ ትሬዲንግ ዋን ሜምበር ፒኤልሲ - ድሬዳዋ፣ ኢትዮጵያ"
    }
  };

  const currentT = t[lang];

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: lang === 'am' 
        ? "ሰላም! እኔ የግርማይክ ቴክኖሎጂ የድሬዳዋ አስተዳደር ኤአይ ረዳት ነኝ። በደብዳቤ ዝግጅት፣ በሪፖርት ማጠናቀሪያ እና በህዝብ አገልግሎት አሰጣጥ ላይ ልረዳዎ ዝግጁ ነኝ። ምን እንሰራ?"
        : lang === 'om'
        ? "Nagaan dhuftan! Ani gargaaraa AI Bulchiinsa Dirree Dawaati. Xalayaa qopheessuuf, gabaasaaf fi tajaajila hawaasaaf qophaa'eera."
        : lang === 'so'
        ? "Waan fiican! Waxaan ahay Kaaliyaha AI ee Maamulka Dire Dawa. Diyaar baan u ahay inaan kaa caawiyo diyaarinta waraaqaha iyo warbixinnada."
        : lang === 'ti'
        ? "ሰላም! ኣነ ናይ ግርማይክ ቴክኖሎጂ ድሬዳዋ አስተዳደር ኤአይ ሓጋዚ እየ። ኣብ ደብዳቤ ምድላው፣ ሪፖርት ንምዝዛምን ኣብ ህዝባዊ ግልጋሎት ክሕግዘኩም ድሉው እየ።"
        : "Hello! I am Girmaic Technology's Dire Dawa Administration AI Assistant. Ready to help you with official letters, reports, and public service tasks."
      ,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Document Generator state
  const [docType, setDocType] = useState<'letter' | 'report' | 'memo' | 'summary'>('letter');
  const [docTopic, setDocTopic] = useState('');
  const [docDetails, setDocDetails] = useState('');
  const [docResult, setDocResult] = useState('');
  const [isDocLoading, setIsDocLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Queue state
  const [requests, setRequests] = useState<CitizenRequest[]>([
    { id: '1', trackingNumber: 'DD-2026-001', citizenName: 'አበበ ከበደ', serviceType: 'የንግድ ፈቃድ እድሳት', office: 'የንግድና ገበያ ልማት ቢሮ', status: 'In Review', date: '2026-11-24', phone: '+251911223344' },
    { id: '2', trackingNumber: 'DD-2026-002', citizenName: 'ፋጡማ አህመድ', serviceType: 'የመሬት ይዞታ ማረጋገጫ', office: 'ከተማ መሬት ልማት ቢሮ', status: 'Approved', date: '2026-11-23', phone: '+251922334455' },
    { id: '3', trackingNumber: 'DD-2026-003', citizenName: 'ዮሃንስ ታደሰ', serviceType: 'የውሃ መስመር ግንኙነት ጥያቄ', office: 'የውሃና ፍሳሽ ባለስልጣን', status: 'Completed', date: '2026-11-22', phone: '+251933445566' }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newRequestModal, setNewRequestModal] = useState(false);
  const [newCitizenName, setNewCitizenName] = useState('');
  const [newServiceType, setNewServiceType] = useState('');
  const [newOffice, setNewOffice] = useState('');
  const [newPhone, setNewPhone] = useState('');

  // Translator state
  const [sourceText, setSourceText] = useState('');
  const [targetLang, setTargetLang] = useState<Language>('en');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, language: lang })
      });
      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.text || 'መልስ ማግኘት አልተቻለም።',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: 'የሰርቨር ስህተት አጋጥሟል። እባክዎ እንደገና ይሞክሩ።',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleGenerateDoc = async () => {
    if (!docTopic.trim()) return;
    setIsDocLoading(true);
    setDocResult('');

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: docType, topic: docTopic, details: docDetails, language: lang })
      });
      const data = await res.json();
      setDocResult(data.text || '');
    } catch (err) {
      console.error(err);
      setDocResult('ስህተት አጋጥሟል። እባክዎ እንደገና ይሞክሩ።');
    } finally {
      setIsDocLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setIsTranslating(true);
    setTranslatedText('');

    const langNames: Record<Language, string> = {
      am: 'አማርኛ (Amharic)',
      en: 'እንግሊዝኛ (English)',
      om: 'አፋን ኦሮሞ (Afan Oromo)',
      so: 'ሶማሊኛ (Somali)',
      ti: 'ትግርኛ (Tigrinya)'
    };

    try {
      const res = await fetch('/api/gemini/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: sourceText, targetLanguage: langNames[targetLang] })
      });
      const data = await res.json();
      setTranslatedText(data.text || '');
    } catch (err) {
      console.error(err);
      setTranslatedText('የተሳሳተ ጥያቄ።');
    } finally {
      setIsTranslating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCitizenName || !newServiceType || !newOffice) return;

    const newReq: CitizenRequest = {
      id: Date.now().toString(),
      trackingNumber: `DD-2026-${Math.floor(100 + Math.random() * 900)}`,
      citizenName: newCitizenName,
      serviceType: newServiceType,
      office: newOffice,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      phone: newPhone || '+251900000000'
    };

    setRequests([newReq, ...requests]);
    setNewCitizenName('');
    setNewServiceType('');
    setNewOffice('');
    setNewPhone('');
    setNewRequestModal(false);
  };

  const filteredRequests = requests.filter(r => 
    r.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      
      {/* Top Bar Contract (Zone 1: Brand, Zone 2: Nav, Zone 3: Primary Action / Language) */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 bg-emerald-700 text-white rounded-xl flex items-center justify-center font-bold shadow-sm">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight leading-none text-slate-900 dark:text-white">
              {currentT.brand}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {currentT.subtitle}
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button 
            onClick={() => setActiveTab('chat')} 
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${activeTab === 'chat' ? 'border-emerald-600 text-slate-900 dark:text-white font-semibold' : 'border-transparent hover:text-slate-900 dark:hover:text-white'}`}
          >
            {currentT.navChat}
          </button>
          <button 
            onClick={() => setActiveTab('docs')} 
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${activeTab === 'docs' ? 'border-emerald-600 text-slate-900 dark:text-white font-semibold' : 'border-transparent hover:text-slate-900 dark:hover:text-white'}`}
          >
            {currentT.navDocs}
          </button>
          <button 
            onClick={() => setActiveTab('queue')} 
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${activeTab === 'queue' ? 'border-emerald-600 text-slate-900 dark:text-white font-semibold' : 'border-transparent hover:text-slate-900 dark:hover:text-white'}`}
          >
            {currentT.navQueue}
          </button>
          <button 
            onClick={() => setActiveTab('translate')} 
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${activeTab === 'translate' ? 'border-emerald-600 text-slate-900 dark:text-white font-semibold' : 'border-transparent hover:text-slate-900 dark:hover:text-white'}`}
          >
            {currentT.navTranslate}
          </button>
        </nav>

        {/* Zone 3: Language Selector & Mobile Menu toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 text-xs">
            <Globe className="w-3.5 h-3.5 ml-1.5 mr-1 text-slate-500" />
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value as Language)}
              className="bg-transparent font-medium text-slate-700 dark:text-slate-200 outline-none pr-2 cursor-pointer"
            >
              <option value="am" className="dark:bg-slate-900">አማርኛ (Amharic)</option>
              <option value="en" className="dark:bg-slate-900">English</option>
              <option value="om" className="dark:bg-slate-900">Afan Oromo</option>
              <option value="so" className="dark:bg-slate-900">Soomaali</option>
              <option value="ti" className="dark:bg-slate-900">ትግርኛ (Tigrinya)</option>
            </select>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex flex-col gap-3">
          <button onClick={() => { setActiveTab('chat'); setMobileMenuOpen(false); }} className="text-left py-2 font-medium">
            {currentT.navChat}
          </button>
          <button onClick={() => { setActiveTab('docs'); setMobileMenuOpen(false); }} className="text-left py-2 font-medium">
            {currentT.navDocs}
          </button>
          <button onClick={() => { setActiveTab('queue'); setMobileMenuOpen(false); }} className="text-left py-2 font-medium">
            {currentT.navQueue}
          </button>
          <button onClick={() => { setActiveTab('translate'); setMobileMenuOpen(false); }} className="text-left py-2 font-medium">
            {currentT.navTranslate}
          </button>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        
        {/* Welcome Hero Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-700/50 rounded-full text-xs font-medium mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Dire Dawa City Administration AI Portal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-balance">
              {currentT.welcomeBanner}
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              {currentT.bannerDesc}
            </p>
          </div>
        </div>

        {/* Tab 1: AI Chat Assistant */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Quick Prompts Sidebar */}
            <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xs">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                {currentT.quickPromptsHeader}
              </h3>
              <div className="flex flex-col gap-2.5">
                {[currentT.prompt1, currentT.prompt2, currentT.prompt3, currentT.prompt4].map((promptText, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(promptText)}
                    className="text-left text-xs bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-slate-700 dark:text-slate-300 hover:text-emerald-800 dark:hover:text-emerald-300 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 transition-all flex items-start justify-between gap-2 group"
                  >
                    <span>{promptText}</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 text-emerald-600" />
                  </button>
                ))}
              </div>
            </div>

            {/* Main Chat Interface */}
            <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col h-[650px] shadow-xs">
              {/* Chat Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                  >
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user' 
                        ? 'bg-emerald-600 text-white rounded-br-none shadow-sm' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700/60'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1 font-mono tabular-nums">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="mr-auto bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-bl-none text-sm text-slate-500 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                    <span>{currentT.generating}</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={currentT.chatPlaceholder}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={isChatLoading || !inputMessage.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-5 py-3 rounded-xl font-medium text-sm transition-colors flex items-center gap-2 shrink-0 shadow-sm"
                >
                  <span>{currentT.send}</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Document & Report Generator */}
        {activeTab === 'docs' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Input Column */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-5 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                {currentT.navDocs}
              </h3>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {currentT.docType}
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="letter">{currentT.letter}</option>
                  <option value="report">{currentT.report}</option>
                  <option value="memo">{currentT.memo}</option>
                  <option value="summary">{currentT.summary}</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {currentT.topicLabel}
                </label>
                <input
                  type="text"
                  value={docTopic}
                  onChange={(e) => setDocTopic(e.target.value)}
                  placeholder="ለምሳሌ፡ የክፍለ ከተማ አስተዳደር የስብሰባ ጥሪ እና አጀንዳ..."
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {currentT.detailsLabel}
                </label>
                <textarea
                  rows={4}
                  value={docDetails}
                  onChange={(e) => setDocDetails(e.target.value)}
                  placeholder="ቀን፣ ተሳታፊዎች፣ የተወሰኑ ውሳኔዎች ወይም ተጨማሪ ማብራሪያዎች..."
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none"
                />
              </div>

              <button
                onClick={handleGenerateDoc}
                disabled={isDocLoading || !docTopic.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm mt-2"
              >
                {isDocLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{currentT.generating}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{currentT.generateBtn}</span>
                  </>
                )}
              </button>
            </div>

            {/* Generated Output Preview Column */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white">የተዘጋጀው ሰነድ ውጤት</h4>
                {docResult && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(docResult)}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? currentT.copied : currentT.copy}</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{currentT.print}</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 overflow-y-auto text-sm leading-relaxed whitespace-pre-wrap font-serif min-h-[350px]">
                {docResult || (
                  <span className="text-slate-400 font-sans italic">
                    እባክዎ በግራ በኩል ያለውን ፎርም በመሙላት "ሰነድ ፍጠር" የሚለውን ይጫኑ...
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Citizen Service Queue & Request Tracker */}
        {activeTab === 'queue' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  {currentT.queueTitle}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  የህብረተሰብ ጥያቄዎችን፣ የፍቃድ እድሳቶችን እና የቀጠሮ ሁኔታዎችን ይከታተሉ።
                </p>
              </div>

              <button
                onClick={() => setNewRequestModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 shadow-sm shrink-0 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>{currentT.addRequest}</span>
              </button>
            </div>

            {/* Search filter bar */}
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={currentT.searchPlaceholder}
                className="bg-transparent text-sm w-full outline-none"
              />
            </div>

            {/* Requests Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">መለያ ቁጥር (ID)</th>
                    <th className="py-3 px-4">{currentT.citizenName}</th>
                    <th className="py-3 px-4">{currentT.serviceType}</th>
                    <th className="py-3 px-4">{currentT.officeName}</th>
                    <th className="py-3 px-4">{currentT.statusLabel}</th>
                    <th className="py-3 px-4">ቀን</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm font-medium">
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono tabular-nums text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {req.trackingNumber}
                      </td>
                      <td className="py-3.5 px-4 text-slate-900 dark:text-white">
                        {req.citizenName}
                        <div className="text-[11px] font-normal text-slate-400">{req.phone}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">{req.serviceType}</td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-xs">{req.office}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          req.status === 'Completed' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300' :
                          req.status === 'Approved' ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300' :
                          req.status === 'In Review' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300' :
                          'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                          {req.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {req.status === 'In Review' && <Clock className="w-3.5 h-3.5" />}
                          {req.status === 'Approved' && <ShieldCheck className="w-3.5 h-3.5" />}
                          <span>{req.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono tabular-nums text-slate-500">{req.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Request Modal */}
            {newRequestModal && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-xl flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <h4 className="font-bold text-base text-slate-900 dark:text-white">አዲስ የህብረተሰብ ጥያቄ መዝግብ</h4>
                    <button onClick={() => setNewRequestModal(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <form onSubmit={handleAddRequest} className="flex flex-col gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">{currentT.citizenName}</label>
                      <input
                        type="text"
                        required
                        value={newCitizenName}
                        onChange={(e) => setNewCitizenName(e.target.value)}
                        placeholder="የአመልካች ሙሉ ስም"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">{currentT.serviceType}</label>
                      <input
                        type="text"
                        required
                        value={newServiceType}
                        onChange={(e) => setNewServiceType(e.target.value)}
                        placeholder="ለምሳሌ፡ የንግድ ፈቃድ እድሳት"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">{currentT.officeName}</label>
                      <input
                        type="text"
                        required
                        value={newOffice}
                        onChange={(e) => setNewOffice(e.target.value)}
                        placeholder="የታለመው መስሪያ ቤት"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">ስልክ ቁጥር</label>
                      <input
                        type="text"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder="+2519..."
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setNewRequestModal(false)}
                        className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        ይቅር
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        መዝግብ
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Multi-lingual Translator */}
        {activeTab === 'translate' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Source Box */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-4 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Languages className="w-5 h-5 text-emerald-600" />
                {currentT.translateTitle}
              </h3>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {currentT.sourceText}
                </label>
                <textarea
                  rows={6}
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="ለትርጉም የሚሆን ጽሁፍ እዚህ ይጻፉ..."
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">{currentT.targetLang}:</span>
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value as Language)}
                    className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-medium"
                  >
                    <option value="am">አማርኛ</option>
                    <option value="en">English</option>
                    <option value="om">Afan Oromo</option>
                    <option value="so">Soomaali</option>
                    <option value="ti">ትግርኛ</option>
                  </select>
                </div>

                <button
                  onClick={handleTranslate}
                  disabled={isTranslating || !sourceText.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                  {isTranslating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>{currentT.translateBtn}</span>
                </button>
              </div>
            </div>

            {/* Output Box */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{currentT.resultText}</h4>
                {translatedText && (
                  <button
                    onClick={() => copyToClipboard(translatedText)}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{currentT.copied ? currentT.copied : currentT.copy}</span>
                  </button>
                )}
              </div>

              <div className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 overflow-y-auto text-sm leading-relaxed whitespace-pre-wrap min-h-[220px]">
                {translatedText || (
                  <span className="text-slate-400 italic">ትርጉሙ እዚህ ይታያል...</span>
                )}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400 mt-12 bg-white dark:bg-slate-900">
        {currentT.footer}
      </footer>
    </div>
  );
}

# 🎯 Mini AI enabled CRM Platform 

## 🚀 Overview

This is a **Mini CRM Platform** built for learning purpose. The application enables users to ingest customer/order data, build smart customer segments, run targeted campaigns, and leverage AI to enhance campaign effectiveness.

## VIDEO 
https://cumailin-my.sharepoint.com/:v:/g/personal/22bet10026_cuchd_in/Eci4GCReOktDsTwggcirsycB7ZogAckeQ3zWrxAToArjAw?e=OxpiUe&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D




---

## 🛠 Tech Stack

| Layer        | Tech                         |
|--------------|------------------------------|
| Frontend     | Next.js, React.js            |
| Backend      | Node.js, Express.js          |
| Database     | MongoDB (Mongoose)           |
| Authentication | Google OAuth 2.0           |
| Messaging Queue (Optional) | Redis Streams / Kafka |
| AI Integration | Gemini API (Google AI Studio) |

---

## ✨ Features

### ✅ Data Ingestion API
- Secure REST APIs for ingesting **customers** and **orders**.
- Postman documentation included.
- (Bonus) Supports **pub-sub architecture** for async DB persistence via Redis Streams.

### ✅ Campaign Builder UI
- Build customer segments with **dynamic rule builder** using AND/OR logic.
- Real-time audience **preview count**.
- Drag-and-drop interface for UX enhancements.

### ✅ Campaign History & Logging
- On segment creation, start a campaign:
  - Store in `communication_log`.
  - Send personalized message using a **mock vendor API** (~90% success rate).
  - Record delivery receipt via Delivery API.

### ✅ Google OAuth
- Users must log in with Google to access segment and campaign features.

### ✅ AI Integration – Powered by **Gemini API**
- ✍️ **Natural Language to Segment Rules**  
  Convert human prompts like "People who spent more than ₹5,000 and inactive for 3 months" into actual filters.

- 🧠 **Message Suggestions**  
  Based on campaign objective (e.g., "win back inactive users"), generate 2–3 message variants.

---

## 📊 Architecture Diagram


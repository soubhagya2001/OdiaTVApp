# 📺 OdiaTVApp

**OdiaTVApp** is a modern, user-friendly **Expo-based React Native** application designed for streaming **free Odia (Odisha language)** TV channels on Android.  
It features a clean, card-based home screen, smooth HLS video streaming, orientation-aware layouts, offline detection, image caching, and intuitive gesture controls for volume and brightness adjustments.

---

## 🚀 Features

### 🏠 Home Screen
- Displays a grid of channel cards with **English and Odia names**.  
- Uses **cached logos** for faster loading and offline availability.

### 🎥 Streaming
- Supports **HLS (m3u8)** streams using `expo-av`.  
- **Swipe gestures** on the video player:  
  - ➡️ Right side → Adjust **Volume**  
  - ⬅️ Left side → Adjust **Brightness**  
- Visual progress bars appear to show the current level (0–100%).

### 📱 Orientation Handling
- **Landscape mode:** Auto full-screen video with header and status bar hidden.  
- **Portrait mode:** Video occupies the top half of the screen; channel list displayed below.

### ⚡ Offline Support
- Displays a **bilingual (English/Odia)** alert when internet is unavailable.  
- Disables channel selection until connection is restored.

### 🎨 UI/UX
- Modern design with **gradients, shadows, and safe area handling**.  
- Optimized to avoid overlap with navigation bars.

### ⚙️ Performance
- Uses `expo-image` for **image caching** (logos available offline after first load).  
- Built with **modular and reusable components** for maintainability.

### 🔒 Permissions
- Requests **brightness control permission** on startup to enable gesture-based brightness adjustments.

---

## 📸 App Screenshots

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/soubhagya2001/OdiaTVApp/raw/main/assets/home-screen.jpg" alt="Home Screen" width="200" height="300"/><br>
      <strong>🏠 Home Screen</strong>
    </td>
    <td align="center">
      <img src="https://github.com/soubhagya2001/OdiaTVApp/raw/main/assets/player-screen.jpg" alt="Player Screen" width="200" height="300"/><br>
      <strong>🎬 Player Screen</strong>
    </td>
  </tr>
</table>


---

## 📡 Supported Channels

- Alankar  
- Bada Khabar  
- DD Odia  
- Kalinga TV  
- Kanak News  
- Nandighosha TV  
- Naxatra News  
- OTV  
- Prameya News  
- Prathana TV  
- Tarang Music  
- Tarang TV  

---

## 🧩 Prerequisites

- **Node.js:** Version 18 or higher  
- **Expo CLI:** Install globally  
  ```bash
  npm install -g @expo/cli


## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/soubhagya2001/OdiaTVApp.git
   cd OdiaTVApp

2. **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install

3. **Start the app:**
    ```bash
    npx expo start

4. **Run the app:**
    - Open the Expo Go app on your Android device and scan the QR code, or 
    - For Android emulator, press a in the terminal.

## 📱 Usage

### 🏠 Home Screen
- Tap a **channel card** to start streaming.  
- If offline, channel cards are **grayed out** and disabled.

### 🎬 Player Screen
- **Portrait Mode:**
  - Video occupies the **top 50%** of the screen.
  - Channel list appears below (tap to switch channels).
- **Landscape Mode:**
  - Video goes **full-screen**, hiding the header and status bar.
- **Gestures:**
  - Swipe **up/down on the right** → adjust **volume**  
  - Swipe **up/down on the left** → adjust **brightness**  
  - A visual progress bar shows the adjustment levels (0–100%).

### 🌐 Offline Mode
- Turn off Wi-Fi to see the **bilingual (English/Odia)** alert.  
- Channels remain disabled until the connection is restored.

---

## 📁 Project Structure
OdiaTVApp/
├── assets/
│ ├── channels.json # Channel data (stream URLs, logos, names)
│ └── logo.png # App icon and splash screen image
├── src/
│ ├── components/ # Reusable UI components
│ │ ├── ChannelCard.js
│ │ ├── ChannelList.js
│ │ └── VideoPlayer.js
│ ├── screens/ # Screen components
│ │ ├── HomeScreen.js
│ │ └── PlayerScreen.js
│ ├── navigation/ # Navigation setup
│ │ └── AppNavigator.js
│ └── constants.js # Shared constants (colors, fonts, spacing)
├── App.js # App entry point with splash screen and permissions
├── app.json # Expo configuration
├── package.json # Dependencies
├── README.md # Project documentation
└── LICENSE # MIT license


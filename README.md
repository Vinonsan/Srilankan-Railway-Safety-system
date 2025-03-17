# Wildlife Protection System for Train Safety

## 🚀 Overview
A smart system designed to protect wildlife, particularly elephants and bulls, from train-related accidents. By leveraging real-time object detection and weather forecasting, the system enhances train safety while promoting wildlife conservation.

## 🎯 Key Features
- **Real-time Animal Detection:** Utilizes **YOLOv8** to detect animals near railway tracks within a **250-meter** range.
- **Weather Forecast Integration:** Predicts weather conditions at current and upcoming locations.
- **Voice Command Alerts:** Provides train pilots with **instant alerts** for potential animal presence and hazardous weather conditions.
- **Optimized for Efficiency:** Ensures quick and reliable response times to prevent accidents.

## 🛠️ Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Machine Learning Model:** YOLOv8
- **Other Integrations:** Weather API for forecasting

## 🎯 Objectives
- Reduce wildlife casualties due to train-related accidents.
- Enhance train safety by providing real-time alerts.
- Leverage AI-powered detection for proactive accident prevention.

## 📸 System Workflow
1. **Camera feeds** monitor railway tracks continuously.
2. **YOLOv8** detects animals within a 250-meter range.
3. Weather forecasting module **predicts upcoming conditions**.
4. Train pilots receive **voice command alerts** for timely action.

## 📌 Installation & Setup
### Prerequisites
- Node.js & npm installed
- PostgreSQL database setup
- API keys for weather forecasting

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo.git
   ```
2. Navigate to the project folder:
   ```bash
   cd wildlife-protection-system
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure environment variables in a `.env` file:
   ```env
   
   WEATHER_API_KEY=422e1d8e08dad104d47a623408c8f5a1
   ```
5. Start the backend server:
   ```bash
   npm run server
   ```
6. Start the frontend application:
   ```bash
   npm run dev
   ```

## 🔥 Future Enhancements
- Extend detection to other endangered species.
- Improve accuracy with advanced AI models.
- Implement automated train braking systems.

## 🤝 Contribution
Contributions are welcome! Feel free to open issues and submit pull requests.

## 📜 License
This project is licensed under [MIT License](LICENSE).

---
**🚀 Protecting Wildlife | Ensuring Train Safety**


import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import BottomTabs from "./components/BottomTabs";
import FloatingChatButton from "./components/FloatingChatButton";
import HomePage from "./pages/HomePage";
import CoachView from "./pages/CoachView";
import RoutesPage from "./pages/RoutesPage";
import RouteDetails from "./pages/RouteDetails";
import AnalyticsPage from "./pages/AnalyticsPage";
import ProfilePage from "./pages/ProfilePage";
import ChatbotPage from "./pages/ChatbotPage";
import TicketingPage from "./pages/TicketingPage";
import CrowdDetection from "./pages/CrowdDetection";
import NotFound from "./pages/NotFound";

const App = () => (
  <ThemeProvider defaultTheme="dark">
    <BrowserRouter>
      <div className="max-w-lg mx-auto min-h-screen relative">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/coach" element={<CoachView />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/route-details" element={<RouteDetails />} />
          <Route path="/ticketing" element={<TicketingPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/crowd-detection" element={<CrowdDetection />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <FloatingChatButton />
        <BottomTabs />
      </div>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;

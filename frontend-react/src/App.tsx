import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { JobsPage } from "./pages/JobsPage";
import { ResumePage } from "./pages/ResumePage";
import { SettingsPage } from "./pages/SettingsPage";
import { ReferralsPage } from "./pages/ReferralsPage";
import { CompaniesPage } from "./pages/CompaniesPage";
import { NotesPage } from "./pages/NotesPage";

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<JobsPage />} />
                    <Route path="/builder" element={<ResumePage />} />
                    <Route path="/referrals" element={<ReferralsPage />} />
                    <Route path="/companies" element={<CompaniesPage />} />
                    <Route path="/notes" element={<NotesPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;

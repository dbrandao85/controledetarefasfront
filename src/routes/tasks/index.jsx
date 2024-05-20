import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { List } from "../../pages";
import { AddTask } from "../../pages";

export const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element = {<><AddTask /><List /></>} />
            </Routes>
        </Router>
    );
}
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/Home";
import { Essays } from "./pages/Essays";
import { Post } from "./pages/Post";
import { About } from "./pages/About";
import { Photography } from "./pages/Photography";
import { CategoryPage } from "./pages/CategoryPage";
import { Search } from "./pages/Search";
import { ScrollToTop } from "./components/ScrollToTop";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/essays" element={<Essays />} />
        <Route path="/essays/:slug" element={<Post />} />
        <Route path="/docs/sam/:slug" element={<Post />} />
        <Route path="/post/:slug" element={<Post />} />
        <Route
          path="/sam"
          element={
            <CategoryPage
              category="sam"
              eyebrow="Systematic Autonomous Machinery"
              title="SAM Architecture & Docs"
              description="Typed decision primitives, infrastructure benchmarking cookbooks, and hybrid edge-to-local Go runtime specifications for AgentSam."
            />
          }
        />
        <Route path="/docs/sam" element={<Navigate to="/sam" replace />} />
        <Route
          path="/design"
          element={
            <CategoryPage
              category="design"
              eyebrow="Design & Platform Systems"
              title="UI/UX & Theme Architecture"
              description="Master UX guides, dual-mode ASBD color specs, asymmetric split media heroes, and multi-domain CMS section schemas."
            />
          }
        />
        <Route path="/photography" element={<Photography />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import StringPage from './pages/StringPage';
import NumberPage from './pages/NumberPage';
import ObjectPage from './pages/ObjectPage';
import ArrayPage from './pages/ArrayPage';
import UnionPage from './pages/UnionPage';
import OptionalPage from './pages/OptionalPage';
import EnumPage from './pages/EnumPage';
import TransformPage from './pages/TransformPage';
import ObjectMethodsPage from './pages/ObjectMethodsPage';
import DefaultPage from './pages/DefaultPage';
import EffectsPage from './pages/EffectsPage';
import IntersectionPage from './pages/IntersectionPage';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/string" element={<StringPage />} />
          <Route path="/number" element={<NumberPage />} />
          <Route path="/object" element={<ObjectPage />} />
          <Route path="/object-methods" element={<ObjectMethodsPage />} />
          <Route path="/array" element={<ArrayPage />} />
          <Route path="/union" element={<UnionPage />} />
          <Route path="/optional" element={<OptionalPage />} />
          <Route path="/enum" element={<EnumPage />} />
          <Route path="/transform" element={<TransformPage />} />
          <Route path="/default" element={<DefaultPage />} />
          <Route path="/effects" element={<EffectsPage />} />
          <Route path="/intersection" element={<IntersectionPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

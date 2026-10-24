import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes, useParams } from 'react-router';
function Order() { return <h1>Order {useParams().id}</h1>; }
createRoot(document.getElementById('root')).render(
    <BrowserRouter><Routes><Route path="/" element={<h1>Home</h1>} /><Route path="/orders/:id" element={<Order />} /></Routes></BrowserRouter>,
);

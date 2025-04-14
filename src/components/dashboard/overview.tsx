"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", uploads: 4 },
  { name: "Feb", uploads: 3 },
  { name: "Mar", uploads: 5 },
  { name: "Apr", uploads: 7 },
  { name: "May", uploads: 2 },
  { name: "Jun", uploads: 6 },
  { name: "Jul", uploads: 8 },
  { name: "Aug", uploads: 9 },
  { name: "Sep", uploads: 11 },
  { name: "Oct", uploads: 6 },
  { name: "Nov", uploads: 4 },
  { name: "Dec", uploads: 5 },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="uploads" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
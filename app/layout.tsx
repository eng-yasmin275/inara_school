import './globals.css';
import React from 'react';


export const metadata = {
title: 'نظام إدارة المدرسة',
description: 'نظام لإدارة طلاب ومعلمي المدرسة بالعربية',
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="ar" dir="rtl">
<body className="rtl">
{children}
</body>
</html>
);
}